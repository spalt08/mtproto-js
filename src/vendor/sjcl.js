"use strict";var sjcl={cipher:{},hash:{},keyexchange:{},mode:{},misc:{},codec:{},exception:{corrupt:function(a){this.toString=function(){return"CORRUPT: "+this.message};this.message=a},invalid:function(a){this.toString=function(){return"INVALID: "+this.message};this.message=a},bug:function(a){this.toString=function(){return"BUG: "+this.message};this.message=a},notReady:function(a){this.toString=function(){return"NOT READY: "+this.message};this.message=a}}};
sjcl.bitArray={bitSlice:function(a,b,c){a=sjcl.bitArray.o(a.slice(b/32),32-(b&31)).slice(1);return void 0===c?a:sjcl.bitArray.clamp(a,c-b)},extract:function(a,b,c){var d=Math.floor(-b-c&31);return((b+c-1^b)&-32?a[b/32|0]<<32-d^a[b/32+1|0]>>>d:a[b/32|0]>>>d)&(1<<c)-1},concat:function(a,b){if(0===a.length||0===b.length)return a.concat(b);var c=a[a.length-1],d=sjcl.bitArray.getPartial(c);return 32===d?a.concat(b):sjcl.bitArray.o(b,d,c|0,a.slice(0,a.length-1))},bitLength:function(a){var b=a.length;return 0===
b?0:32*(b-1)+sjcl.bitArray.getPartial(a[b-1])},clamp:function(a,b){if(32*a.length<b)return a;a=a.slice(0,Math.ceil(b/32));var c=a.length;b=b&31;0<c&&b&&(a[c-1]=sjcl.bitArray.partial(b,a[c-1]&2147483648>>b-1,1));return a},partial:function(a,b,c){return 32===a?b:(c?b|0:b<<32-a)+0x10000000000*a},getPartial:function(a){return Math.round(a/0x10000000000)||32},equal:function(a,b){if(sjcl.bitArray.bitLength(a)!==sjcl.bitArray.bitLength(b))return!1;var c=0,d;for(d=0;d<a.length;d++)c|=a[d]^b[d];return 0===
c},o:function(a,b,c,d){var e;e=0;for(void 0===d&&(d=[]);32<=b;b-=32)d.push(c),c=0;if(0===b)return d.concat(a);for(e=0;e<a.length;e++)d.push(c|a[e]>>>b),c=a[e]<<32-b;e=a.length?a[a.length-1]:0;a=sjcl.bitArray.getPartial(e);d.push(sjcl.bitArray.partial(b+a&31,32<b+a?c:d.pop(),1));return d},w:function(a,b){return[a[0]^b[0],a[1]^b[1],a[2]^b[2],a[3]^b[3]]},byteswapM:function(a){var b,c;for(b=0;b<a.length;++b)c=a[b],a[b]=c>>>24|c>>>8&0xff00|(c&0xff00)<<8|c<<24;return a}};
sjcl.codec.utf8String={fromBits:function(a){var b="",c=sjcl.bitArray.bitLength(a),d,e;for(d=0;d<c/8;d++)0===(d&3)&&(e=a[d/4]),b+=String.fromCharCode(e>>>8>>>8>>>8),e<<=8;return decodeURIComponent(escape(b))},toBits:function(a){a=unescape(encodeURIComponent(a));var b=[],c,d=0;for(c=0;c<a.length;c++)d=d<<8|a.charCodeAt(c),3===(c&3)&&(b.push(d),d=0);c&3&&b.push(sjcl.bitArray.partial(8*(c&3),d));return b}};
sjcl.codec.hex={fromBits:function(a){var b="",c;for(c=0;c<a.length;c++)b+=((a[c]|0)+0xf00000000000).toString(16).substr(4);return b.substr(0,sjcl.bitArray.bitLength(a)/4)},toBits:function(a){var b,c=[],d;a=a.replace(/\s|0x/g,"");d=a.length;a=a+"00000000";for(b=0;b<a.length;b+=8)c.push(parseInt(a.substr(b,8),16)^0);return sjcl.bitArray.clamp(c,4*d)}};sjcl.hash.sha256=function(a){this.f[0]||this.j();a?(this.c=a.c.slice(0),this.b=a.b.slice(0),this.a=a.a):this.reset()};sjcl.hash.sha256.hash=function(a){return(new sjcl.hash.sha256).update(a).finalize()};
sjcl.hash.sha256.prototype={blockSize:512,reset:function(){this.c=this.h.slice(0);this.b=[];this.a=0;return this},update:function(a){"string"===typeof a&&(a=sjcl.codec.utf8String.toBits(a));var b,c=this.b=sjcl.bitArray.concat(this.b,a);b=this.a;a=this.a=b+sjcl.bitArray.bitLength(a);if(0x1fffffffffffff<a)throw new sjcl.exception.invalid("Cannot hash more than 2^53 - 1 bits");if("undefined"!==typeof Uint32Array){var d=new Uint32Array(c),e=0;for(b=512+b-(512+b&0x1ff);b<=a;b+=512)this.g(d.subarray(16*e,
16*(e+1))),e+=1;c.splice(0,16*e)}else for(b=512+b-(512+b&0x1ff);b<=a;b+=512)this.g(c.splice(0,16));return this},finalize:function(){var a,b=this.b,c=this.c,b=sjcl.bitArray.concat(b,[sjcl.bitArray.partial(1,1)]);for(a=b.length+2;a&15;a++)b.push(0);b.push(Math.floor(this.a/0x100000000));for(b.push(this.a|0);b.length;)this.g(b.splice(0,16));this.reset();return c},h:[],f:[],j:function(){function a(a){return 0x100000000*(a-Math.floor(a))|0}for(var b=0,c=2,d,e;64>b;c++){e=!0;for(d=2;d*d<=c;d++)if(0===c%d){e=
!1;break}e&&(8>b&&(this.h[b]=a(Math.pow(c,.5))),this.f[b]=a(Math.pow(c,1/3)),b++)}},g:function(a){var b,c,d,e=this.c,m=this.f,t=e[0],f=e[1],n=e[2],p=e[3],h=e[4],y=e[5],w=e[6],z=e[7];for(b=0;64>b;b++)16>b?c=a[b]:(c=a[b+1&15],d=a[b+14&15],c=a[b&15]=(c>>>7^c>>>18^c>>>3^c<<25^c<<14)+(d>>>17^d>>>19^d>>>10^d<<15^d<<13)+a[b&15]+a[b+9&15]|0),c=c+z+(h>>>6^h>>>11^h>>>25^h<<26^h<<21^h<<7)+(w^h&(y^w))+m[b],z=w,w=y,y=h,h=p+c|0,p=n,n=f,f=t,t=c+(f&n^p&(f^n))+(f>>>2^f>>>13^f>>>22^f<<30^f<<19^f<<10)|0;e[0]=e[0]+t|
0;e[1]=e[1]+f|0;e[2]=e[2]+n|0;e[3]=e[3]+p|0;e[4]=e[4]+h|0;e[5]=e[5]+y|0;e[6]=e[6]+w|0;e[7]=e[7]+z|0}};sjcl.hash.sha512=function(a){this.f[0]||this.j();a?(this.c=a.c.slice(0),this.b=a.b.slice(0),this.a=a.a):this.reset()};sjcl.hash.sha512.hash=function(a){return(new sjcl.hash.sha512).update(a).finalize()};
sjcl.hash.sha512.prototype={blockSize:1024,reset:function(){this.c=this.h.slice(0);this.b=[];this.a=0;return this},update:function(a){"string"===typeof a&&(a=sjcl.codec.utf8String.toBits(a));var b,c=this.b=sjcl.bitArray.concat(this.b,a);b=this.a;a=this.a=b+sjcl.bitArray.bitLength(a);if(0x1fffffffffffff<a)throw new sjcl.exception.invalid("Cannot hash more than 2^53 - 1 bits");if("undefined"!==typeof Uint32Array){var d=new Uint32Array(c),e=0;for(b=1024+b-(1024+b&1023);b<=a;b+=1024)this.g(d.subarray(32*
e,32*(e+1))),e+=1;c.splice(0,32*e)}else for(b=1024+b-(1024+b&1023);b<=a;b+=1024)this.g(c.splice(0,32));return this},finalize:function(){var a,b=this.b,c=this.c,b=sjcl.bitArray.concat(b,[sjcl.bitArray.partial(1,1)]);for(a=b.length+4;a&31;a++)b.push(0);b.push(0);b.push(0);b.push(Math.floor(this.a/0x100000000));for(b.push(this.a|0);b.length;)this.g(b.splice(0,32));this.reset();return c},h:[],u:[12372232,13281083,9762859,1914609,15106769,4090911,4308331,8266105],f:[],v:[2666018,15689165,5061423,9034684,
4764984,380953,1658779,7176472,197186,7368638,14987916,16757986,8096111,1480369,13046325,6891156,15813330,5187043,9229749,11312229,2818677,10937475,4324308,1135541,6741931,11809296,16458047,15666916,11046850,698149,229999,945776,13774844,2541862,12856045,9810911,11494366,7844520,15576806,8533307,15795044,4337665,16291729,5553712,15684120,6662416,7413802,12308920,13816008,4303699,9366425,10176680,13195875,4295371,6546291,11712675,15708924,1519456,15772530,6568428,6495784,8568297,13007125,7492395,2515356,
12632583,14740254,7262584,1535930,13146278,16321966,1853211,294276,13051027,13221564,1051980,4080310,6651434,14088940,4675607],j:function(){function a(a){return 0x100000000*(a-Math.floor(a))|0}function b(a){return 0x10000000000*(a-Math.floor(a))&255}for(var c=0,d=2,e,m;80>c;d++){m=!0;for(e=2;e*e<=d;e++)if(0===d%e){m=!1;break}m&&(8>c&&(this.h[2*c]=a(Math.pow(d,.5)),this.h[2*c+1]=b(Math.pow(d,.5))<<24|this.u[c]),this.f[2*c]=a(Math.pow(d,1/3)),this.f[2*c+1]=b(Math.pow(d,1/3))<<24|this.v[c],c++)}},g:function(a){var b,
c,d=this.c,e=this.f,m=d[0],t=d[1],f=d[2],n=d[3],p=d[4],h=d[5],y=d[6],w=d[7],z=d[8],J=d[9],T=d[10],K=d[11],U=d[12],L=d[13],V=d[14],M=d[15],l;if("undefined"!==typeof Uint32Array){l=Array(160);for(var k=0;32>k;k++)l[k]=a[k]}else l=a;var k=m,q=t,C=f,A=n,D=p,B=h,P=y,E=w,u=z,r=J,N=T,F=K,O=U,G=L,Q=V,H=M;for(a=0;80>a;a++){if(16>a)b=l[2*a],c=l[2*a+1];else{c=l[2*(a-15)];var g=l[2*(a-15)+1];b=(g<<31|c>>>1)^(g<<24|c>>>8)^c>>>7;var v=(c<<31|g>>>1)^(c<<24|g>>>8)^(c<<25|g>>>7);c=l[2*(a-2)];var x=l[2*(a-2)+1],g=
(x<<13|c>>>19)^(c<<3|x>>>29)^c>>>6,x=(c<<13|x>>>19)^(x<<3|c>>>29)^(c<<26|x>>>6),R=l[2*(a-7)],S=l[2*(a-16)],I=l[2*(a-16)+1];c=v+l[2*(a-7)+1];b=b+R+(c>>>0<v>>>0?1:0);c+=x;b+=g+(c>>>0<x>>>0?1:0);c+=I;b+=S+(c>>>0<I>>>0?1:0)}l[2*a]=b|=0;l[2*a+1]=c|=0;var R=u&N^~u&O,W=r&F^~r&G,x=k&C^k&D^C&D,Y=q&A^q&B^A&B,S=(q<<4|k>>>28)^(k<<30|q>>>2)^(k<<25|q>>>7),I=(k<<4|q>>>28)^(q<<30|k>>>2)^(q<<25|k>>>7),Z=e[2*a],X=e[2*a+1],g=H+((u<<18|r>>>14)^(u<<14|r>>>18)^(r<<23|u>>>9)),v=Q+((r<<18|u>>>14)^(r<<14|u>>>18)^(u<<23|r>>>
9))+(g>>>0<H>>>0?1:0),g=g+W,v=v+(R+(g>>>0<W>>>0?1:0)),g=g+X,v=v+(Z+(g>>>0<X>>>0?1:0)),g=g+c|0,v=v+(b+(g>>>0<c>>>0?1:0));c=I+Y;b=S+x+(c>>>0<I>>>0?1:0);Q=O;H=G;O=N;G=F;N=u;F=r;r=E+g|0;u=P+v+(r>>>0<E>>>0?1:0)|0;P=D;E=B;D=C;B=A;C=k;A=q;q=g+c|0;k=v+b+(q>>>0<g>>>0?1:0)|0}t=d[1]=t+q|0;d[0]=m+k+(t>>>0<q>>>0?1:0)|0;n=d[3]=n+A|0;d[2]=f+C+(n>>>0<A>>>0?1:0)|0;h=d[5]=h+B|0;d[4]=p+D+(h>>>0<B>>>0?1:0)|0;w=d[7]=w+E|0;d[6]=y+P+(w>>>0<E>>>0?1:0)|0;J=d[9]=J+r|0;d[8]=z+u+(J>>>0<r>>>0?1:0)|0;K=d[11]=K+F|0;d[10]=T+N+(K>>>
0<F>>>0?1:0)|0;L=d[13]=L+G|0;d[12]=U+O+(L>>>0<G>>>0?1:0)|0;M=d[15]=M+H|0;d[14]=V+Q+(M>>>0<H>>>0?1:0)|0}};sjcl.misc.hmac=function(a,b){this.m=b=b||sjcl.hash.sha256;var c=[[],[]],d,e=b.prototype.blockSize/32;this.i=[new b,new b];a.length>e&&(a=b.hash(a));for(d=0;d<e;d++)c[0][d]=a[d]^909522486,c[1][d]=a[d]^1549556828;this.i[0].update(c[0]);this.i[1].update(c[1]);this.l=new b(this.i[0])};
sjcl.misc.hmac.prototype.encrypt=sjcl.misc.hmac.prototype.mac=function(a){if(this.s)throw new sjcl.exception.invalid("encrypt on already updated hmac called!");this.update(a);return this.digest(a)};sjcl.misc.hmac.prototype.reset=function(){this.l=new this.m(this.i[0]);this.s=!1};sjcl.misc.hmac.prototype.update=function(a){this.s=!0;this.l.update(a)};sjcl.misc.hmac.prototype.digest=function(){var a=this.l.finalize(),a=(new this.m(this.i[1])).update(a).finalize();this.reset();return a};
sjcl.misc.pbkdf2=function(a,b,c,d,e){c=c||1E4;if(0>d||0>c)throw new sjcl.exception.invalid("invalid params to pbkdf2");"string"===typeof a&&(a=sjcl.codec.utf8String.toBits(a));"string"===typeof b&&(b=sjcl.codec.utf8String.toBits(b));e=e||sjcl.misc.hmac;a=new e(a);var m,t,f,n,p=[],h=sjcl.bitArray;for(n=1;32*p.length<(d||1);n++){e=m=a.encrypt(h.concat(b,[n]));for(t=1;t<c;t++)for(m=a.encrypt(m),f=0;f<m.length;f++)e[f]^=m[f];p=p.concat(e)}d&&(p=h.clamp(p,d));return p};
"undefined"!==typeof module&&module.exports&&(module.exports=sjcl);"function"===typeof define&&define([],function(){return sjcl});
