uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;
varying vec3 vPosition;

float mod289(float x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 perm(vec4 x){return mod289(((x*34.)+1.)*x);}

float noise(vec3 p){
    vec3 a=floor(p);
    vec3 d=p-a;
    d=d*d*(3.-2.*d);
    
    vec4 b=a.xxyy+vec4(0.,1.,0.,1.);
    vec4 k1=perm(b.xyxy);
    vec4 k2=perm(k1.xyxy+b.zzww);
    
    vec4 c=k2+a.zzzz;
    vec4 k3=perm(c);
    vec4 k4=perm(c+1.);
    
    vec4 o1=fract(k3*(1./41.));
    vec4 o2=fract(k4*(1./41.));
    
    vec4 o3=o2*d.z+o1*(1.-d.z);
    vec2 o4=o3.yw*d.x+o3.xz*(1.-d.x);
    
    return o4.y*d.y+o4.x*(1.-d.y);
}

float lines(vec2 uv,float offset){
    return smoothstep(0.,.5+offset*.5,abs(.5*sin(uv.x*10.)+offset*.5));
}

mat2 rotate2D(float angle) {
    return mat2(
        cos(angle), -sin(angle),
        sin(angle), cos(angle)
    );
}

void main(){

    float nPos = noise(vPosition);
    float nPosTime = noise(vPosition + uTime);
    
    vec2 baseUv=rotate2D(nPosTime) * vPosition.xy * 0.5;
    // vec2 baseUv=vPosition.xy;
    float pattern1=lines(baseUv, 0.1);
    float pattern2=lines(baseUv, 0.5);

    // vec3 baseClr1 = vec3(128./255., 158./255., 113./255.);
    vec3 baseClr1 = vec3(1., 1., 1.);
    vec3 baseClr2 = vec3(0., 0., 0.);
    vec3 baseClr3 = vec3(1., 0., 0.);

    vec3 finalClr1 = mix(baseClr3, baseClr1, pattern1);
    vec3 finalClr2 = mix(finalClr1, baseClr2, pattern2);

    vec2 uv2 = vUv;
    uv2.y -= .5;
    uv2.x -= .5;
    
    // gl_FragColor=vec4(vec3(finalClr2),1.);
    // gl_FragColor=vec4(uv2.x , 0. , 0. ,1.);
    // gl_FragColor=vec4(uv2 , 1. ,1.);
    gl_FragColor=vec4(fract(uv2) , 1. ,1.);
    
}