uniform float uTime;

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

void main(){
    
    float redIntensity=(sin(uTime)+1.5)/2.5;
    float greenIntensity=(sin(uTime*2.)+1.5)/2.5;
    float blueIntensity=(sin(uTime*7.)+1.5)/2.5;
    
    // gl_FragColor=vec4(redIntensity,greenIntensity,blueIntensity,1.);
    
    float noise_based_on_position=noise(vPosition*5.+uTime);
    float noise_based_on_position2=noise(vPosition*3.+uTime);
    float noise_based_on_position3=noise(vPosition*2.+uTime);
    
    gl_FragColor=vec4(noise_based_on_position,noise_based_on_position2,noise_based_on_position3,1.);
    
}