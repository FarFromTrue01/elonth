(()=>{var Ki=Object.create;var Kn=Object.defineProperty;var Zi=Object.getOwnPropertyDescriptor;var $i=Object.getOwnPropertyNames;var Ji=Object.getPrototypeOf,es=Object.prototype.hasOwnProperty;var ts=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports);var ns=(t,e,n,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of $i(e))!es.call(t,i)&&i!==n&&Kn(t,i,{get:()=>e[i],enumerable:!(r=Zi(e,i))||r.enumerable});return t};var A=(t,e,n)=>(n=t!=null?Ki(Ji(t)):{},ns(e||!t||!t.__esModule?Kn(n,"default",{value:t,enumerable:!0}):n,t));var R=ts((wa,Zn)=>{Zn.exports=window.THREE});var Hr=A(R(),1),ie=A(R(),1),Ot=A(R(),1),Nr=A(R(),1),j=A(R(),1),te=A(R(),1),at=A(R(),1),X=A(R(),1),N=A(R(),1),We=A(R(),1),se=A(R(),1),U=A(R(),1),Ct=A(R(),1),C=A(R(),1),St=A(R(),1),Or=A(R(),1),lt=A(R(),1),Qr=A(R(),1),Kr=A(R(),1),P=A(R(),1),Zr=A(R(),1),ei=A(R(),1),F=A(R(),1),Z=A(R(),1),Bt=A(R(),1),Ge=A(R(),1),J=A(R(),1),ae=A(R(),1),ze=A(R(),1),Le=A(R(),1),Ft=A(R(),1),ee=A(R(),1),oe=A(R(),1),Ee=A(R(),1),le=A(R(),1),Te=A(R(),1),ut=A(R(),1),B=A(R(),1),ni=A(R(),1),ri=A(R(),1),G=A(R(),1),ui=A(R(),1),Pe=A(R(),1),ci=A(R(),1),di=A(R(),1),ct=A(R(),1),ue=A(R(),1),dt=A(R(),1);/*!
 * @pixiv/three-vrm v3.5.5
 * VRM file loader for three.js.
 *
 * Copyright (c) 2019-2026 pixiv Inc.
 * @pixiv/three-vrm is distributed under MIT License
 * https://github.com/pixiv/three-vrm/blob/release/LICENSE
 */var Qe=(t,e,n)=>new Promise((r,i)=>{var s=a=>{try{l(n.next(a))}catch(u){i(u)}},o=a=>{try{l(n.throw(a))}catch(u){i(u)}},l=a=>a.done?r(a.value):Promise.resolve(a.value).then(s,o);l((n=n.apply(t,e)).next())}),L=(t,e,n)=>new Promise((r,i)=>{var s=a=>{try{l(n.next(a))}catch(u){i(u)}},o=a=>{try{l(n.throw(a))}catch(u){i(u)}},l=a=>a.done?r(a.value):Promise.resolve(a.value).then(s,o);l((n=n.apply(t,e)).next())}),$n=class extends Hr.Object3D{constructor(t){super(),this.weight=0,this.isBinary=!1,this.overrideBlink="none",this.overrideLookAt="none",this.overrideMouth="none",this._binds=[],this.name=`VRMExpression_${t}`,this.expressionName=t,this.type="VRMExpression",this.visible=!1}get binds(){return this._binds}get overrideBlinkAmount(){return this.overrideBlink==="block"?0<this.outputWeight?1:0:this.overrideBlink==="blend"?this.outputWeight:0}get overrideLookAtAmount(){return this.overrideLookAt==="block"?0<this.outputWeight?1:0:this.overrideLookAt==="blend"?this.outputWeight:0}get overrideMouthAmount(){return this.overrideMouth==="block"?0<this.outputWeight?1:0:this.overrideMouth==="blend"?this.outputWeight:0}get outputWeight(){return this.isBinary?this.weight>.5?1:0:this.weight}addBind(t){this._binds.push(t)}deleteBind(t){let e=this._binds.indexOf(t);e>=0&&this._binds.splice(e,1)}applyWeight(t){var e;let n=this.outputWeight;n*=(e=t?.multiplier)!=null?e:1,this.isBinary&&n<1&&(n=0),this._binds.forEach(r=>r.applyWeight(n))}clearAppliedWeight(){this._binds.forEach(t=>t.clearAppliedWeight())}};function Cr(t,e,n){var r,i;let s=t.parser.json,o=(r=s.nodes)==null?void 0:r[e];if(o==null)return console.warn(`extractPrimitivesInternal: Attempt to use nodes[${e}] of glTF but the node doesn't exist`),null;let l=o.mesh;if(l==null)return null;let a=(i=s.meshes)==null?void 0:i[l];if(a==null)return console.warn(`extractPrimitivesInternal: Attempt to use meshes[${l}] of glTF but the mesh doesn't exist`),null;let u=a.primitives.length,d=[];return n.traverse(c=>{d.length<u&&c.isMesh&&d.push(c)}),d}function Jn(t,e){return L(this,null,function*(){let n=yield t.parser.getDependency("node",e);return Cr(t,e,n)})}function er(t){return L(this,null,function*(){let e=yield t.parser.getDependencies("node"),n=new Map;return e.forEach((r,i)=>{let s=Cr(t,i,r);s!=null&&n.set(i,s)}),n})}var bt={Aa:"aa",Ih:"ih",Ou:"ou",Ee:"ee",Oh:"oh",Blink:"blink",Happy:"happy",Angry:"angry",Sad:"sad",Relaxed:"relaxed",LookUp:"lookUp",Surprised:"surprised",LookDown:"lookDown",LookLeft:"lookLeft",LookRight:"lookRight",BlinkLeft:"blinkLeft",BlinkRight:"blinkRight",Neutral:"neutral"};function Ur(t){return Math.max(Math.min(t,1),0)}var tr=class Vr{constructor(){this.blinkExpressionNames=["blink","blinkLeft","blinkRight"],this.lookAtExpressionNames=["lookLeft","lookRight","lookUp","lookDown"],this.mouthExpressionNames=["aa","ee","ih","oh","ou"],this._expressions=[],this._expressionMap={}}get expressions(){return this._expressions.concat()}get expressionMap(){return Object.assign({},this._expressionMap)}get presetExpressionMap(){let e={},n=new Set(Object.values(bt));return Object.entries(this._expressionMap).forEach(([r,i])=>{n.has(r)&&(e[r]=i)}),e}get customExpressionMap(){let e={},n=new Set(Object.values(bt));return Object.entries(this._expressionMap).forEach(([r,i])=>{n.has(r)||(e[r]=i)}),e}copy(e){return this._expressions.concat().forEach(r=>{this.unregisterExpression(r)}),e._expressions.forEach(r=>{this.registerExpression(r)}),this.blinkExpressionNames=e.blinkExpressionNames.concat(),this.lookAtExpressionNames=e.lookAtExpressionNames.concat(),this.mouthExpressionNames=e.mouthExpressionNames.concat(),this}clone(){return new Vr().copy(this)}getExpression(e){var n;return(n=this._expressionMap[e])!=null?n:null}registerExpression(e){this._expressions.push(e),this._expressionMap[e.expressionName]=e}unregisterExpression(e){let n=this._expressions.indexOf(e);n===-1&&console.warn("VRMExpressionManager: The specified expressions is not registered"),this._expressions.splice(n,1),delete this._expressionMap[e.expressionName]}getValue(e){var n;let r=this.getExpression(e);return(n=r?.weight)!=null?n:null}setValue(e,n){let r=this.getExpression(e);r&&(r.weight=Ur(n))}resetValues(){this._expressions.forEach(e=>{e.weight=0})}getExpressionTrackName(e){let n=this.getExpression(e);return n?`${n.name}.weight`:null}update(){let e=this._calculateWeightMultipliers();this._expressions.forEach(n=>{n.clearAppliedWeight()}),this._expressions.forEach(n=>{let r=1,i=n.expressionName;this.blinkExpressionNames.indexOf(i)!==-1&&(r*=e.blink),this.lookAtExpressionNames.indexOf(i)!==-1&&(r*=e.lookAt),this.mouthExpressionNames.indexOf(i)!==-1&&(r*=e.mouth),n.applyWeight({multiplier:r})})}_calculateWeightMultipliers(){let e=1,n=1,r=1;return this._expressions.forEach(i=>{e-=i.overrideBlinkAmount,n-=i.overrideLookAtAmount,r-=i.overrideMouthAmount}),e=Math.max(0,e),n=Math.max(0,n),r=Math.max(0,r),{blink:e,lookAt:n,mouth:r}}},Ce={Color:"color",EmissionColor:"emissionColor",ShadeColor:"shadeColor",MatcapColor:"matcapColor",RimColor:"rimColor",OutlineColor:"outlineColor"},rs={_Color:Ce.Color,_EmissionColor:Ce.EmissionColor,_ShadeColor:Ce.ShadeColor,_RimColor:Ce.RimColor,_OutlineColor:Ce.OutlineColor},is=new Ot.Color,Br=class Dr{constructor({material:e,type:n,targetValue:r,targetAlpha:i}){this.material=e,this.type=n,this.targetValue=r,this.targetAlpha=i??1;let s=this._initColorBindState(),o=this._initAlphaBindState();this._state={color:s,alpha:o}}applyWeight(e){let{color:n,alpha:r}=this._state;if(n!=null){let{propertyName:i,deltaValue:s}=n,o=this.material[i];o?.add(is.copy(s).multiplyScalar(e))}if(r!=null){let{propertyName:i,deltaValue:s}=r;this.material[i]!=null&&(this.material[i]+=s*e)}}clearAppliedWeight(){let{color:e,alpha:n}=this._state;if(e!=null){let{propertyName:r,initialValue:i}=e,s=this.material[r];s?.copy(i)}if(n!=null){let{propertyName:r,initialValue:i}=n;this.material[r]!=null&&(this.material[r]=i)}}_initColorBindState(){var e,n,r;let{material:i,type:s,targetValue:o}=this,l=this._getPropertyNameMap(),a=(n=(e=l?.[s])==null?void 0:e[0])!=null?n:null;if(a==null)return console.warn(`Tried to add a material color bind to the material ${(r=i.name)!=null?r:"(no name)"}, the type ${s} but the material or the type is not supported.`),null;let d=i[a].clone(),c=new Ot.Color(o.r-d.r,o.g-d.g,o.b-d.b);return{propertyName:a,initialValue:d,deltaValue:c}}_initAlphaBindState(){var e,n,r;let{material:i,type:s,targetAlpha:o}=this,l=this._getPropertyNameMap(),a=(n=(e=l?.[s])==null?void 0:e[1])!=null?n:null;if(a==null&&o!==1)return console.warn(`Tried to add a material alpha bind to the material ${(r=i.name)!=null?r:"(no name)"}, the type ${s} but the material or the type does not support alpha.`),null;if(a==null)return null;let u=i[a],d=o-u;return{propertyName:a,initialValue:u,deltaValue:d}}_getPropertyNameMap(){var e,n;return(n=(e=Object.entries(Dr._propertyNameMapMap).find(([r])=>this.material[r]===!0))==null?void 0:e[1])!=null?n:null}};Br._propertyNameMapMap={isMeshStandardMaterial:{color:["color","opacity"],emissionColor:["emissive",null]},isMeshBasicMaterial:{color:["color","opacity"]},isMToonMaterial:{color:["color","opacity"],emissionColor:["emissive",null],outlineColor:["outlineColorFactor",null],matcapColor:["matcapFactor",null],rimColor:["parametricRimColorFactor",null],shadeColor:["shadeColorFactor",null]}};var nr=Br,be=class{constructor({primitives:t,index:e,weight:n}){this.primitives=t,this.index=e,this.weight=n}applyWeight(t){this.primitives.forEach(e=>{var n;((n=e.morphTargetInfluences)==null?void 0:n[this.index])!=null&&(e.morphTargetInfluences[this.index]+=this.weight*t)})}clearAppliedWeight(){this.primitives.forEach(t=>{var e;((e=t.morphTargetInfluences)==null?void 0:e[this.index])!=null&&(t.morphTargetInfluences[this.index]=0)})}},rr=new Nr.Vector2,Fr=class kr{constructor({material:e,scale:n,offset:r}){var i,s;this.material=e,this.scale=n,this.offset=r;let o=(i=Object.entries(kr._propertyNamesMap).find(([l])=>e[l]===!0))==null?void 0:i[1];o==null?(console.warn(`Tried to add a texture transform bind to the material ${(s=e.name)!=null?s:"(no name)"} but the material is not supported.`),this._properties=[]):(this._properties=[],o.forEach(l=>{var a;let u=(a=e[l])==null?void 0:a.clone();if(!u)return null;e[l]=u;let d=u.offset.clone(),c=u.repeat.clone(),h=r.clone().sub(d),p=n.clone().sub(c);this._properties.push({name:l,initialOffset:d,deltaOffset:h,initialScale:c,deltaScale:p})}))}applyWeight(e){this._properties.forEach(n=>{let r=this.material[n.name];r!==void 0&&(r.offset.add(rr.copy(n.deltaOffset).multiplyScalar(e)),r.repeat.add(rr.copy(n.deltaScale).multiplyScalar(e)))})}clearAppliedWeight(){this._properties.forEach(e=>{let n=this.material[e.name];n!==void 0&&(n.offset.copy(e.initialOffset),n.repeat.copy(e.initialScale))})}};Fr._propertyNamesMap={isMeshStandardMaterial:["map","emissiveMap","bumpMap","normalMap","displacementMap","roughnessMap","metalnessMap","alphaMap"],isMeshBasicMaterial:["map","specularMap","alphaMap"],isMToonMaterial:["map","normalMap","emissiveMap","shadeMultiplyTexture","rimMultiplyTexture","outlineWidthMultiplyTexture","uvAnimationMaskTexture"]};var ir=Fr,ss=new Set(["1.0","1.0-beta"]),Wr=class Gr{get name(){return"VRMExpressionLoaderPlugin"}constructor(e){this.parser=e}afterRoot(e){return L(this,null,function*(){e.userData.vrmExpressionManager=yield this._import(e)})}_import(e){return L(this,null,function*(){let n=yield this._v1Import(e);if(n)return n;let r=yield this._v0Import(e);return r||null})}_v1Import(e){return L(this,null,function*(){var n,r;let i=this.parser.json;if(!(((n=i.extensionsUsed)==null?void 0:n.indexOf("VRMC_vrm"))!==-1))return null;let o=(r=i.extensions)==null?void 0:r.VRMC_vrm;if(!o)return null;let l=o.specVersion;if(!ss.has(l))return console.warn(`VRMExpressionLoaderPlugin: Unknown VRMC_vrm specVersion "${l}"`),null;let a=o.expressions;if(!a)return null;let u=new Set(Object.values(bt)),d=new Map;a.preset!=null&&Object.entries(a.preset).forEach(([h,p])=>{if(p!=null){if(!u.has(h)){console.warn(`VRMExpressionLoaderPlugin: Unknown preset name "${h}" detected. Ignoring the expression`);return}d.set(h,p)}}),a.custom!=null&&Object.entries(a.custom).forEach(([h,p])=>{if(u.has(h)){console.warn(`VRMExpressionLoaderPlugin: Custom expression cannot have preset name "${h}". Ignoring the expression`);return}d.set(h,p)});let c=new tr;return yield Promise.all(Array.from(d.entries()).map(h=>L(this,[h],function*([p,m]){var g,_,v,T,x,E,M;let y=new $n(p);if(e.scene.add(y),y.isBinary=(g=m.isBinary)!=null?g:!1,y.overrideBlink=(_=m.overrideBlink)!=null?_:"none",y.overrideLookAt=(v=m.overrideLookAt)!=null?v:"none",y.overrideMouth=(T=m.overrideMouth)!=null?T:"none",(x=m.morphTargetBinds)==null||x.forEach(w=>L(this,null,function*(){var b;if(w.node===void 0||w.index===void 0)return;let H=yield Jn(e,w.node),I=w.index;if(!H.every(O=>Array.isArray(O.morphTargetInfluences)&&I<O.morphTargetInfluences.length)){console.warn(`VRMExpressionLoaderPlugin: ${m.name} attempts to index morph #${I} but not found.`);return}y.addBind(new be({primitives:H,index:I,weight:(b=w.weight)!=null?b:1}))})),m.materialColorBinds||m.textureTransformBinds){let w=[];e.scene.traverse(b=>{let H=b.material;H&&(Array.isArray(H)?w.push(...H):w.push(H))}),(E=m.materialColorBinds)==null||E.forEach(b=>L(this,null,function*(){w.filter(I=>{var O;let V=(O=this.parser.associations.get(I))==null?void 0:O.materials;return b.material===V}).forEach(I=>{y.addBind(new nr({material:I,type:b.type,targetValue:new ie.Color().fromArray(b.targetValue),targetAlpha:b.targetValue[3]}))})})),(M=m.textureTransformBinds)==null||M.forEach(b=>L(this,null,function*(){w.filter(I=>{var O;let V=(O=this.parser.associations.get(I))==null?void 0:O.materials;return b.material===V}).forEach(I=>{var O,V;y.addBind(new ir({material:I,offset:new ie.Vector2().fromArray((O=b.offset)!=null?O:[0,0]),scale:new ie.Vector2().fromArray((V=b.scale)!=null?V:[1,1])}))})}))}c.registerExpression(y)}))),c})}_v0Import(e){return L(this,null,function*(){var n;let r=this.parser.json,i=(n=r.extensions)==null?void 0:n.VRM;if(!i)return null;let s=i.blendShapeMaster;if(!s)return null;let o=new tr,l=s.blendShapeGroups;if(!l)return o;let a=new Set;return yield Promise.all(l.map(u=>L(this,null,function*(){var d;let c=u.presetName,h=c!=null&&Gr.v0v1PresetNameMap[c]||null,p=h??u.name;if(p==null){console.warn("VRMExpressionLoaderPlugin: One of custom expressions has no name. Ignoring the expression");return}if(a.has(p)){console.warn(`VRMExpressionLoaderPlugin: An expression preset ${c} has duplicated entries. Ignoring the expression`);return}a.add(p);let m=new $n(p);e.scene.add(m),m.isBinary=(d=u.isBinary)!=null?d:!1,u.binds&&u.binds.forEach(_=>L(this,null,function*(){var v;if(_.mesh===void 0||_.index===void 0)return;let T=[];if((v=r.nodes)==null||v.forEach((E,M)=>{E.mesh===_.mesh&&T.push(M)}),T.length===0){console.warn(`VRMExpressionLoaderPlugin: ${u.name} attempts to bind a morph target to the mesh #${_.mesh} but the mesh is not found or not used in the scene. Ignoring the bind.`);return}let x=_.index;yield Promise.all(T.map(E=>L(this,null,function*(){var M;let y=yield Jn(e,E);if(!y.every(w=>Array.isArray(w.morphTargetInfluences)&&x<w.morphTargetInfluences.length)){console.warn(`VRMExpressionLoaderPlugin: ${u.name} attempts to index ${x}th morph but not found.`);return}m.addBind(new be({primitives:y,index:x,weight:.01*((M=_.weight)!=null?M:100)}))})))}));let g=u.materialValues;g&&g.length!==0&&g.forEach(_=>{if(_.materialName===void 0||_.propertyName===void 0||_.targetValue===void 0)return;let v=[];e.scene.traverse(x=>{if(x.material){let E=x.material;Array.isArray(E)?v.push(...E.filter(M=>(M.name===_.materialName||M.name===_.materialName+" (Outline)")&&v.indexOf(M)===-1)):E.name===_.materialName&&v.indexOf(E)===-1&&v.push(E)}});let T=_.propertyName;v.forEach(x=>{if(T==="_MainTex_ST"){let M=new ie.Vector2(_.targetValue[0],_.targetValue[1]),y=new ie.Vector2(_.targetValue[2],_.targetValue[3]);y.y=1-y.y-M.y,m.addBind(new ir({material:x,scale:M,offset:y}));return}let E=rs[T];if(E){m.addBind(new nr({material:x,type:E,targetValue:new ie.Color().fromArray(_.targetValue),targetAlpha:_.targetValue[3]}));return}console.warn(T+" is not supported")})}),o.registerExpression(m)}))),o})}};Wr.v0v1PresetNameMap={a:"aa",e:"ee",i:"ih",o:"oh",u:"ou",blink:"blink",joy:"happy",angry:"angry",sorrow:"sad",fun:"relaxed",lookup:"lookUp",lookdown:"lookDown",lookleft:"lookLeft",lookright:"lookRight",blink_l:"blinkLeft",blink_r:"blinkRight",neutral:"neutral"};var os=Wr;var Ut=class we{constructor(e,n){this._firstPersonOnlyLayer=we.DEFAULT_FIRSTPERSON_ONLY_LAYER,this._thirdPersonOnlyLayer=we.DEFAULT_THIRDPERSON_ONLY_LAYER,this._initializedLayers=!1,this.humanoid=e,this.meshAnnotations=n}copy(e){if(this.humanoid!==e.humanoid)throw new Error("VRMFirstPerson: humanoid must be same in order to copy");return this.meshAnnotations=e.meshAnnotations.map(n=>({meshes:n.meshes.concat(),type:n.type})),this}clone(){return new we(this.humanoid,this.meshAnnotations).copy(this)}get firstPersonOnlyLayer(){return this._firstPersonOnlyLayer}get thirdPersonOnlyLayer(){return this._thirdPersonOnlyLayer}setup({firstPersonOnlyLayer:e=we.DEFAULT_FIRSTPERSON_ONLY_LAYER,thirdPersonOnlyLayer:n=we.DEFAULT_THIRDPERSON_ONLY_LAYER}={}){this._initializedLayers||(this._firstPersonOnlyLayer=e,this._thirdPersonOnlyLayer=n,this.meshAnnotations.forEach(r=>{r.meshes.forEach(i=>{r.type==="firstPersonOnly"?(i.layers.set(this._firstPersonOnlyLayer),i.traverse(s=>s.layers.set(this._firstPersonOnlyLayer))):r.type==="thirdPersonOnly"?(i.layers.set(this._thirdPersonOnlyLayer),i.traverse(s=>s.layers.set(this._thirdPersonOnlyLayer))):r.type==="auto"&&this._createHeadlessModel(i)})}),this._initializedLayers=!0)}_excludeTriangles(e,n,r,i){let s=0;if(n!=null&&n.length>0)for(let o=0;o<e.length;o+=3){let l=e[o],a=e[o+1],u=e[o+2],d=n[l],c=r[l];if(d[0]>0&&i.includes(c[0])||d[1]>0&&i.includes(c[1])||d[2]>0&&i.includes(c[2])||d[3]>0&&i.includes(c[3]))continue;let h=n[a],p=r[a];if(h[0]>0&&i.includes(p[0])||h[1]>0&&i.includes(p[1])||h[2]>0&&i.includes(p[2])||h[3]>0&&i.includes(p[3]))continue;let m=n[u],g=r[u];m[0]>0&&i.includes(g[0])||m[1]>0&&i.includes(g[1])||m[2]>0&&i.includes(g[2])||m[3]>0&&i.includes(g[3])||(e[s++]=l,e[s++]=a,e[s++]=u)}return s}_createErasedMesh(e,n){let r=new j.SkinnedMesh(e.geometry.clone(),e.material);r.name=`${e.name}(erase)`,r.frustumCulled=e.frustumCulled,r.layers.set(this._firstPersonOnlyLayer);let i=r.geometry,s=i.getAttribute("skinIndex"),o=s instanceof j.GLBufferAttribute?[]:s.array,l=[];for(let g=0;g<o.length;g+=4)l.push([o[g],o[g+1],o[g+2],o[g+3]]);let a=i.getAttribute("skinWeight"),u=a instanceof j.GLBufferAttribute?[]:a.array,d=[];for(let g=0;g<u.length;g+=4)d.push([u[g],u[g+1],u[g+2],u[g+3]]);let c=i.getIndex();if(!c)throw new Error("The geometry doesn't have an index buffer");let h=Array.from(c.array),p=this._excludeTriangles(h,d,l,n),m=[];for(let g=0;g<p;g++)m[g]=h[g];return i.setIndex(m),e.onBeforeRender&&(r.onBeforeRender=e.onBeforeRender),r.bind(new j.Skeleton(e.skeleton.bones,e.skeleton.boneInverses),new j.Matrix4),r}_createHeadlessModelForSkinnedMesh(e,n){let r=[];if(n.skeleton.bones.forEach((s,o)=>{this._isEraseTarget(s)&&r.push(o)}),!r.length){n.layers.enable(this._thirdPersonOnlyLayer),n.layers.enable(this._firstPersonOnlyLayer);return}n.layers.set(this._thirdPersonOnlyLayer);let i=this._createErasedMesh(n,r);e.add(i)}_createHeadlessModel(e){if(e.type==="Group")if(e.layers.set(this._thirdPersonOnlyLayer),this._isEraseTarget(e))e.traverse(n=>n.layers.set(this._thirdPersonOnlyLayer));else{let n=new j.Group;n.name=`_headless_${e.name}`,n.layers.set(this._firstPersonOnlyLayer),e.parent.add(n),e.children.filter(r=>r.type==="SkinnedMesh").forEach(r=>{let i=r;this._createHeadlessModelForSkinnedMesh(n,i)})}else if(e.type==="SkinnedMesh"){let n=e;this._createHeadlessModelForSkinnedMesh(e.parent,n)}else this._isEraseTarget(e)&&(e.layers.set(this._thirdPersonOnlyLayer),e.traverse(n=>n.layers.set(this._thirdPersonOnlyLayer)))}_isEraseTarget(e){return e===this.humanoid.getRawBoneNode("head")?!0:e.parent?this._isEraseTarget(e.parent):!1}};Ut.DEFAULT_FIRSTPERSON_ONLY_LAYER=9;Ut.DEFAULT_THIRDPERSON_ONLY_LAYER=10;var sr=Ut,as=new Set(["1.0","1.0-beta"]),ls=class{get name(){return"VRMFirstPersonLoaderPlugin"}constructor(t){this.parser=t}afterRoot(t){return L(this,null,function*(){let e=t.userData.vrmHumanoid;if(e!==null){if(e===void 0)throw new Error("VRMFirstPersonLoaderPlugin: vrmHumanoid is undefined. VRMHumanoidLoaderPlugin have to be used first");t.userData.vrmFirstPerson=yield this._import(t,e)}})}_import(t,e){return L(this,null,function*(){if(e==null)return null;let n=yield this._v1Import(t,e);if(n)return n;let r=yield this._v0Import(t,e);return r||null})}_v1Import(t,e){return L(this,null,function*(){var n,r;let i=this.parser.json;if(!(((n=i.extensionsUsed)==null?void 0:n.indexOf("VRMC_vrm"))!==-1))return null;let o=(r=i.extensions)==null?void 0:r.VRMC_vrm;if(!o)return null;let l=o.specVersion;if(!as.has(l))return console.warn(`VRMFirstPersonLoaderPlugin: Unknown VRMC_vrm specVersion "${l}"`),null;let a=o.firstPerson,u=[],d=yield er(t);return Array.from(d.entries()).forEach(([c,h])=>{var p,m;let g=(p=a?.meshAnnotations)==null?void 0:p.find(_=>_.node===c);u.push({meshes:h,type:(m=g?.type)!=null?m:"auto"})}),new sr(e,u)})}_v0Import(t,e){return L(this,null,function*(){var n;let r=this.parser.json,i=(n=r.extensions)==null?void 0:n.VRM;if(!i)return null;let s=i.firstPerson;if(!s)return null;let o=[],l=yield er(t);return Array.from(l.entries()).forEach(([a,u])=>{let d=r.nodes[a],c=s.meshAnnotations?s.meshAnnotations.find(h=>h.mesh===d.mesh):void 0;o.push({meshes:u,type:this._convertV0FlagToV1Type(c?.firstPersonFlag)})}),new sr(e,o)})}_convertV0FlagToV1Type(t){return t==="FirstPersonOnly"?"firstPersonOnly":t==="ThirdPersonOnly"?"thirdPersonOnly":t==="Both"?"both":"auto"}};var or=new te.Vector3,ar=new te.Vector3,us=new te.Quaternion,lr=class extends te.Group{constructor(t){super(),this.vrmHumanoid=t,this._boneAxesMap=new Map,Object.values(t.humanBones).forEach(e=>{let n=new te.AxesHelper(1);n.matrixAutoUpdate=!1,n.material.depthTest=!1,n.material.depthWrite=!1,this.add(n),this._boneAxesMap.set(e,n)})}dispose(){Array.from(this._boneAxesMap.values()).forEach(t=>{t.geometry.dispose(),t.material.dispose()})}updateMatrixWorld(t){Array.from(this._boneAxesMap.entries()).forEach(([e,n])=>{e.node.updateWorldMatrix(!0,!1),e.node.matrixWorld.decompose(or,us,ar);let r=or.set(.1,.1,.1).divide(ar);n.matrix.copy(e.node.matrixWorld).scale(r)}),super.updateMatrixWorld(t)}},gt=["hips","spine","chest","upperChest","neck","head","leftEye","rightEye","jaw","leftUpperLeg","leftLowerLeg","leftFoot","leftToes","rightUpperLeg","rightLowerLeg","rightFoot","rightToes","leftShoulder","leftUpperArm","leftLowerArm","leftHand","rightShoulder","rightUpperArm","rightLowerArm","rightHand","leftThumbMetacarpal","leftThumbProximal","leftThumbDistal","leftIndexProximal","leftIndexIntermediate","leftIndexDistal","leftMiddleProximal","leftMiddleIntermediate","leftMiddleDistal","leftRingProximal","leftRingIntermediate","leftRingDistal","leftLittleProximal","leftLittleIntermediate","leftLittleDistal","rightThumbMetacarpal","rightThumbProximal","rightThumbDistal","rightIndexProximal","rightIndexIntermediate","rightIndexDistal","rightMiddleProximal","rightMiddleIntermediate","rightMiddleDistal","rightRingProximal","rightRingIntermediate","rightRingDistal","rightLittleProximal","rightLittleIntermediate","rightLittleDistal"];var cs={hips:null,spine:"hips",chest:"spine",upperChest:"chest",neck:"upperChest",head:"neck",leftEye:"head",rightEye:"head",jaw:"head",leftUpperLeg:"hips",leftLowerLeg:"leftUpperLeg",leftFoot:"leftLowerLeg",leftToes:"leftFoot",rightUpperLeg:"hips",rightLowerLeg:"rightUpperLeg",rightFoot:"rightLowerLeg",rightToes:"rightFoot",leftShoulder:"upperChest",leftUpperArm:"leftShoulder",leftLowerArm:"leftUpperArm",leftHand:"leftLowerArm",rightShoulder:"upperChest",rightUpperArm:"rightShoulder",rightLowerArm:"rightUpperArm",rightHand:"rightLowerArm",leftThumbMetacarpal:"leftHand",leftThumbProximal:"leftThumbMetacarpal",leftThumbDistal:"leftThumbProximal",leftIndexProximal:"leftHand",leftIndexIntermediate:"leftIndexProximal",leftIndexDistal:"leftIndexIntermediate",leftMiddleProximal:"leftHand",leftMiddleIntermediate:"leftMiddleProximal",leftMiddleDistal:"leftMiddleIntermediate",leftRingProximal:"leftHand",leftRingIntermediate:"leftRingProximal",leftRingDistal:"leftRingIntermediate",leftLittleProximal:"leftHand",leftLittleIntermediate:"leftLittleProximal",leftLittleDistal:"leftLittleIntermediate",rightThumbMetacarpal:"rightHand",rightThumbProximal:"rightThumbMetacarpal",rightThumbDistal:"rightThumbProximal",rightIndexProximal:"rightHand",rightIndexIntermediate:"rightIndexProximal",rightIndexDistal:"rightIndexIntermediate",rightMiddleProximal:"rightHand",rightMiddleIntermediate:"rightMiddleProximal",rightMiddleDistal:"rightMiddleIntermediate",rightRingProximal:"rightHand",rightRingIntermediate:"rightRingProximal",rightRingDistal:"rightRingIntermediate",rightLittleProximal:"rightHand",rightLittleIntermediate:"rightLittleProximal",rightLittleDistal:"rightLittleIntermediate"};function zr(t){return t.invert?t.invert():t.inverse(),t}var me=new at.Vector3,ge=new at.Quaternion,Lt=class{constructor(t){this.humanBones=t,this.restPose=this.getAbsolutePose()}getAbsolutePose(){let t={};return Object.keys(this.humanBones).forEach(e=>{let n=e,r=this.getBoneNode(n);r&&(me.copy(r.position),ge.copy(r.quaternion),t[n]={position:me.toArray(),rotation:ge.toArray()})}),t}getPose(){let t={};return Object.keys(this.humanBones).forEach(e=>{let n=e,r=this.getBoneNode(n);if(!r)return;me.set(0,0,0),ge.identity();let i=this.restPose[n];i?.position&&me.fromArray(i.position).negate(),i?.rotation&&zr(ge.fromArray(i.rotation)),me.add(r.position),ge.premultiply(r.quaternion),t[n]={position:me.toArray(),rotation:ge.toArray()}}),t}setPose(t){Object.entries(t).forEach(([e,n])=>{let r=e,i=this.getBoneNode(r);if(!i)return;let s=this.restPose[r];s&&(n?.position&&(i.position.fromArray(n.position),s.position&&i.position.add(me.fromArray(s.position))),n?.rotation&&(i.quaternion.fromArray(n.rotation),s.rotation&&i.quaternion.multiply(ge.fromArray(s.rotation))))})}resetPose(){Object.entries(this.restPose).forEach(([t,e])=>{let n=this.getBoneNode(t);n&&(e?.position&&n.position.fromArray(e.position),e?.rotation&&n.quaternion.fromArray(e.rotation))})}getBone(t){var e;return(e=this.humanBones[t])!=null?e:void 0}getBoneNode(t){var e,n;return(n=(e=this.humanBones[t])==null?void 0:e.node)!=null?n:null}},_t=new X.Vector3,ds=new X.Quaternion,hs=new X.Vector3,ur=class jr extends Lt{static _setupTransforms(e){let n=new X.Object3D;n.name="VRMHumanoidRig";let r={},i={},s={},o={};gt.forEach(a=>{var u;let d=e.getBoneNode(a);if(d){let c=new X.Vector3,h=new X.Quaternion;d.updateWorldMatrix(!0,!1),d.matrixWorld.decompose(c,h,_t),r[a]=c,i[a]=h,s[a]=d.quaternion.clone();let p=new X.Quaternion;(u=d.parent)==null||u.matrixWorld.decompose(_t,p,_t),o[a]=p}});let l={};return gt.forEach(a=>{var u;let d=e.getBoneNode(a);if(d){let c=r[a],h=a,p;for(;p==null&&(h=cs[h],h!=null);)p=r[h];let m=new X.Object3D;m.name="Normalized_"+d.name,(h?(u=l[h])==null?void 0:u.node:n).add(m),m.position.copy(c),p&&m.position.sub(p),l[a]={node:m}}}),{rigBones:l,root:n,parentWorldRotations:o,boneRotations:s}}constructor(e){let{rigBones:n,root:r,parentWorldRotations:i,boneRotations:s}=jr._setupTransforms(e);super(n),this.original=e,this.root=r,this._parentWorldRotations=i,this._boneRotations=s}update(){gt.forEach(e=>{let n=this.original.getBoneNode(e);if(n!=null){let r=this.getBoneNode(e),i=this._parentWorldRotations[e],s=ds.copy(i).invert(),o=this._boneRotations[e];if(n.quaternion.copy(r.quaternion).multiply(i).premultiply(s).multiply(o),e==="hips"){let l=r.getWorldPosition(hs);n.parent.updateWorldMatrix(!0,!1);let a=n.parent.matrixWorld,u=l.applyMatrix4(a.invert());n.position.copy(u)}}})}},nt=class Xr{get restPose(){return console.warn("VRMHumanoid: restPose is deprecated. Use either rawRestPose or normalizedRestPose instead."),this.rawRestPose}get rawRestPose(){return this._rawHumanBones.restPose}get normalizedRestPose(){return this._normalizedHumanBones.restPose}get humanBones(){return this._rawHumanBones.humanBones}get rawHumanBones(){return this._rawHumanBones.humanBones}get normalizedHumanBones(){return this._normalizedHumanBones.humanBones}get normalizedHumanBonesRoot(){return this._normalizedHumanBones.root}constructor(e,n){var r;this.autoUpdateHumanBones=(r=n?.autoUpdateHumanBones)!=null?r:!0,this._rawHumanBones=new Lt(e),this._normalizedHumanBones=new ur(this._rawHumanBones)}copy(e){return this.autoUpdateHumanBones=e.autoUpdateHumanBones,this._rawHumanBones=new Lt(e.humanBones),this._normalizedHumanBones=new ur(this._rawHumanBones),this}clone(){return new Xr(this.humanBones,{autoUpdateHumanBones:this.autoUpdateHumanBones}).copy(this)}getAbsolutePose(){return console.warn("VRMHumanoid: getAbsolutePose() is deprecated. Use either getRawAbsolutePose() or getNormalizedAbsolutePose() instead."),this.getRawAbsolutePose()}getRawAbsolutePose(){return this._rawHumanBones.getAbsolutePose()}getNormalizedAbsolutePose(){return this._normalizedHumanBones.getAbsolutePose()}getPose(){return console.warn("VRMHumanoid: getPose() is deprecated. Use either getRawPose() or getNormalizedPose() instead."),this.getRawPose()}getRawPose(){return this._rawHumanBones.getPose()}getNormalizedPose(){return this._normalizedHumanBones.getPose()}setPose(e){return console.warn("VRMHumanoid: setPose() is deprecated. Use either setRawPose() or setNormalizedPose() instead."),this.setRawPose(e)}setRawPose(e){return this._rawHumanBones.setPose(e)}setNormalizedPose(e){return this._normalizedHumanBones.setPose(e)}resetPose(){return console.warn("VRMHumanoid: resetPose() is deprecated. Use either resetRawPose() or resetNormalizedPose() instead."),this.resetRawPose()}resetRawPose(){return this._rawHumanBones.resetPose()}resetNormalizedPose(){return this._normalizedHumanBones.resetPose()}getBone(e){return console.warn("VRMHumanoid: getBone() is deprecated. Use either getRawBone() or getNormalizedBone() instead."),this.getRawBone(e)}getRawBone(e){return this._rawHumanBones.getBone(e)}getNormalizedBone(e){return this._normalizedHumanBones.getBone(e)}getBoneNode(e){return console.warn("VRMHumanoid: getBoneNode() is deprecated. Use either getRawBoneNode() or getNormalizedBoneNode() instead."),this.getRawBoneNode(e)}getRawBoneNode(e){return this._rawHumanBones.getBoneNode(e)}getNormalizedBoneNode(e){return this._normalizedHumanBones.getBoneNode(e)}update(){this.autoUpdateHumanBones&&this._normalizedHumanBones.update()}},fs={Hips:"hips",Spine:"spine",Head:"head",LeftUpperLeg:"leftUpperLeg",LeftLowerLeg:"leftLowerLeg",LeftFoot:"leftFoot",RightUpperLeg:"rightUpperLeg",RightLowerLeg:"rightLowerLeg",RightFoot:"rightFoot",LeftUpperArm:"leftUpperArm",LeftLowerArm:"leftLowerArm",LeftHand:"leftHand",RightUpperArm:"rightUpperArm",RightLowerArm:"rightLowerArm",RightHand:"rightHand"},ps=new Set(["1.0","1.0-beta"]),cr={leftThumbProximal:"leftThumbMetacarpal",leftThumbIntermediate:"leftThumbProximal",rightThumbProximal:"rightThumbMetacarpal",rightThumbIntermediate:"rightThumbProximal"},ms=class{get name(){return"VRMHumanoidLoaderPlugin"}constructor(t,e){this.parser=t,this.helperRoot=e?.helperRoot,this.autoUpdateHumanBones=e?.autoUpdateHumanBones}afterRoot(t){return L(this,null,function*(){t.userData.vrmHumanoid=yield this._import(t)})}_import(t){return L(this,null,function*(){let e=yield this._v1Import(t);if(e)return e;let n=yield this._v0Import(t);return n||null})}_v1Import(t){return L(this,null,function*(){var e,n;let r=this.parser.json;if(!(((e=r.extensionsUsed)==null?void 0:e.indexOf("VRMC_vrm"))!==-1))return null;let s=(n=r.extensions)==null?void 0:n.VRMC_vrm;if(!s)return null;let o=s.specVersion;if(!ps.has(o))return console.warn(`VRMHumanoidLoaderPlugin: Unknown VRMC_vrm specVersion "${o}"`),null;let l=s.humanoid;if(!l)return null;let a=l.humanBones.leftThumbIntermediate!=null||l.humanBones.rightThumbIntermediate!=null,u={};l.humanBones!=null&&(yield Promise.all(Object.entries(l.humanBones).map(c=>L(this,[c],function*([h,p]){let m=h,g=p.node;if(a){let v=cr[m];v!=null&&(m=v)}let _=yield this.parser.getDependency("node",g);if(_==null){console.warn(`A glTF node bound to the humanoid bone ${m} (index = ${g}) does not exist`);return}u[m]={node:_}}))));let d=new nt(this._ensureRequiredBonesExist(u),{autoUpdateHumanBones:this.autoUpdateHumanBones});if(t.scene.add(d.normalizedHumanBonesRoot),this.helperRoot){let c=new lr(d);this.helperRoot.add(c),c.renderOrder=this.helperRoot.renderOrder}return d})}_v0Import(t){return L(this,null,function*(){var e;let r=(e=this.parser.json.extensions)==null?void 0:e.VRM;if(!r)return null;let i=r.humanoid;if(!i)return null;let s={};i.humanBones!=null&&(yield Promise.all(i.humanBones.map(l=>L(this,null,function*(){let a=l.bone,u=l.node;if(a==null||u==null)return;if(u<0){console.warn(`A glTF node index for the humanoid bone ${a} is negative (${u}), ignoring this bone.`);return}let d=yield this.parser.getDependency("node",u);if(d==null){console.warn(`A glTF node bound to the humanoid bone ${a} (index = ${u}) does not exist`);return}let c=cr[a],h=c??a;if(s[h]!=null){console.warn(`Multiple bone entries for ${h} detected (index = ${u}), ignoring duplicated entries.`);return}s[h]={node:d}}))));let o=new nt(this._ensureRequiredBonesExist(s),{autoUpdateHumanBones:this.autoUpdateHumanBones});if(t.scene.add(o.normalizedHumanBonesRoot),this.helperRoot){let l=new lr(o);this.helperRoot.add(l),l.renderOrder=this.helperRoot.renderOrder}return o})}_ensureRequiredBonesExist(t){let e=Object.values(fs).filter(n=>t[n]==null);if(e.length>0)throw new Error(`VRMHumanoidLoaderPlugin: These humanoid bones are required but not exist: ${e.join(", ")}`);return t}},dr=class extends We.BufferGeometry{constructor(){super(),this._currentTheta=0,this._currentRadius=0,this.theta=0,this.radius=0,this._currentTheta=0,this._currentRadius=0,this._attrPos=new We.BufferAttribute(new Float32Array(195),3),this.setAttribute("position",this._attrPos),this._attrIndex=new We.BufferAttribute(new Uint16Array(189),1),this.setIndex(this._attrIndex),this._buildIndex(),this.update()}update(){let t=!1;this._currentTheta!==this.theta&&(this._currentTheta=this.theta,t=!0),this._currentRadius!==this.radius&&(this._currentRadius=this.radius,t=!0),t&&this._buildPosition()}_buildPosition(){this._attrPos.setXYZ(0,0,0,0);for(let t=0;t<64;t++){let e=t/63*this._currentTheta;this._attrPos.setXYZ(t+1,this._currentRadius*Math.sin(e),0,this._currentRadius*Math.cos(e))}this._attrPos.needsUpdate=!0}_buildIndex(){for(let t=0;t<63;t++)this._attrIndex.setXYZ(t*3,0,t+1,t+2);this._attrIndex.needsUpdate=!0}},gs=class extends se.BufferGeometry{constructor(){super(),this.radius=0,this._currentRadius=0,this.tail=new se.Vector3,this._currentTail=new se.Vector3,this._attrPos=new se.BufferAttribute(new Float32Array(294),3),this.setAttribute("position",this._attrPos),this._attrIndex=new se.BufferAttribute(new Uint16Array(194),1),this.setIndex(this._attrIndex),this._buildIndex(),this.update()}update(){let t=!1;this._currentRadius!==this.radius&&(this._currentRadius=this.radius,t=!0),this._currentTail.equals(this.tail)||(this._currentTail.copy(this.tail),t=!0),t&&this._buildPosition()}_buildPosition(){for(let t=0;t<32;t++){let e=t/16*Math.PI;this._attrPos.setXYZ(t,Math.cos(e),Math.sin(e),0),this._attrPos.setXYZ(32+t,0,Math.cos(e),Math.sin(e)),this._attrPos.setXYZ(64+t,Math.sin(e),0,Math.cos(e))}this.scale(this._currentRadius,this._currentRadius,this._currentRadius),this.translate(this._currentTail.x,this._currentTail.y,this._currentTail.z),this._attrPos.setXYZ(96,0,0,0),this._attrPos.setXYZ(97,this._currentTail.x,this._currentTail.y,this._currentTail.z),this._attrPos.needsUpdate=!0}_buildIndex(){for(let t=0;t<32;t++){let e=(t+1)%32;this._attrIndex.setXY(t*2,t,e),this._attrIndex.setXY(64+t*2,32+t,32+e),this._attrIndex.setXY(128+t*2,64+t,64+e)}this._attrIndex.setXY(192,96,97),this._attrIndex.needsUpdate=!0}},Ke=new N.Quaternion,hr=new N.Quaternion,Ue=new N.Vector3,fr=new N.Vector3,pr=Math.sqrt(2)/2,_s=new N.Quaternion(0,0,-pr,pr),vs=new N.Vector3(0,1,0),Es=class extends N.Group{constructor(t){super(),this.matrixAutoUpdate=!1,this.vrmLookAt=t;{let e=new dr;e.radius=.5;let n=new N.MeshBasicMaterial({color:65280,transparent:!0,opacity:.5,side:N.DoubleSide,depthTest:!1,depthWrite:!1});this._meshPitch=new N.Mesh(e,n),this.add(this._meshPitch)}{let e=new dr;e.radius=.5;let n=new N.MeshBasicMaterial({color:16711680,transparent:!0,opacity:.5,side:N.DoubleSide,depthTest:!1,depthWrite:!1});this._meshYaw=new N.Mesh(e,n),this.add(this._meshYaw)}{let e=new gs;e.radius=.1;let n=new N.LineBasicMaterial({color:16777215,depthTest:!1,depthWrite:!1});this._lineTarget=new N.LineSegments(e,n),this._lineTarget.frustumCulled=!1,this.add(this._lineTarget)}}dispose(){this._meshYaw.geometry.dispose(),this._meshYaw.material.dispose(),this._meshPitch.geometry.dispose(),this._meshPitch.material.dispose(),this._lineTarget.geometry.dispose(),this._lineTarget.material.dispose()}updateMatrixWorld(t){let e=N.MathUtils.DEG2RAD*this.vrmLookAt.yaw;this._meshYaw.geometry.theta=e,this._meshYaw.geometry.update();let n=N.MathUtils.DEG2RAD*this.vrmLookAt.pitch;this._meshPitch.geometry.theta=n,this._meshPitch.geometry.update(),this.vrmLookAt.getLookAtWorldPosition(Ue),this.vrmLookAt.getLookAtWorldQuaternion(Ke),Ke.multiply(this.vrmLookAt.getFaceFrontQuaternion(hr)),this._meshYaw.position.copy(Ue),this._meshYaw.quaternion.copy(Ke),this._meshPitch.position.copy(Ue),this._meshPitch.quaternion.copy(Ke),this._meshPitch.quaternion.multiply(hr.setFromAxisAngle(vs,e)),this._meshPitch.quaternion.multiply(_s);let{target:r,autoUpdate:i}=this.vrmLookAt;r!=null&&i&&(r.getWorldPosition(fr).sub(Ue),this._lineTarget.geometry.tail.copy(fr),this._lineTarget.geometry.update(),this._lineTarget.position.copy(Ue)),super.updateMatrixWorld(t)}},Ts=new Ct.Vector3,Ms=new Ct.Vector3;function Pt(t,e){return t.matrixWorld.decompose(Ts,e,Ms),e}function Je(t){return[Math.atan2(-t.z,t.x),Math.atan2(t.y,Math.sqrt(t.x*t.x+t.z*t.z))]}function mr(t){let e=Math.round(t/2/Math.PI);return t-2*Math.PI*e}var gr=new U.Vector3(0,0,1),Rs=new U.Vector3,xs=new U.Vector3,As=new U.Vector3,ys=new U.Quaternion,vt=new U.Quaternion,_r=new U.Quaternion,ws=new U.Quaternion,Et=new U.Euler,qr=class Yr{constructor(e,n){this.offsetFromHeadBone=new U.Vector3,this.autoUpdate=!0,this.faceFront=new U.Vector3(0,0,1),this.humanoid=e,this.applier=n,this._yaw=0,this._pitch=0,this._needsUpdate=!0,this._restHeadWorldQuaternion=this.getLookAtWorldQuaternion(new U.Quaternion)}get yaw(){return this._yaw}set yaw(e){this._yaw=e,this._needsUpdate=!0}get pitch(){return this._pitch}set pitch(e){this._pitch=e,this._needsUpdate=!0}get euler(){return console.warn("VRMLookAt: euler is deprecated. use getEuler() instead."),this.getEuler(new U.Euler)}getEuler(e){return e.set(U.MathUtils.DEG2RAD*this._pitch,U.MathUtils.DEG2RAD*this._yaw,0,"YXZ")}copy(e){if(this.humanoid!==e.humanoid)throw new Error("VRMLookAt: humanoid must be same in order to copy");return this.offsetFromHeadBone.copy(e.offsetFromHeadBone),this.applier=e.applier,this.autoUpdate=e.autoUpdate,this.target=e.target,this.faceFront.copy(e.faceFront),this}clone(){return new Yr(this.humanoid,this.applier).copy(this)}reset(){this._yaw=0,this._pitch=0,this._needsUpdate=!0}getLookAtWorldPosition(e){let n=this.humanoid.getRawBoneNode("head");return e.copy(this.offsetFromHeadBone).applyMatrix4(n.matrixWorld)}getLookAtWorldQuaternion(e){let n=this.humanoid.getRawBoneNode("head");return Pt(n,e)}getFaceFrontQuaternion(e){if(this.faceFront.distanceToSquared(gr)<.01)return e.copy(this._restHeadWorldQuaternion).invert();let[n,r]=Je(this.faceFront);return Et.set(0,.5*Math.PI+n,r,"YZX"),e.setFromEuler(Et).premultiply(ws.copy(this._restHeadWorldQuaternion).invert())}getLookAtWorldDirection(e){return this.getLookAtWorldQuaternion(vt),this.getFaceFrontQuaternion(_r),e.copy(gr).applyQuaternion(vt).applyQuaternion(_r).applyEuler(this.getEuler(Et))}lookAt(e){let n=ys.copy(this._restHeadWorldQuaternion).multiply(zr(this.getLookAtWorldQuaternion(vt))),r=this.getLookAtWorldPosition(xs),i=As.copy(e).sub(r).applyQuaternion(n).normalize(),[s,o]=Je(this.faceFront),[l,a]=Je(i),u=mr(l-s),d=mr(o-a);this._yaw=U.MathUtils.RAD2DEG*u,this._pitch=U.MathUtils.RAD2DEG*d,this._needsUpdate=!0}update(e){this.target!=null&&this.autoUpdate&&this.lookAt(this.target.getWorldPosition(Rs)),this._needsUpdate&&(this._needsUpdate=!1,this.applier.applyYawPitch(this._yaw,this._pitch))}};qr.EULER_ORDER="YXZ";var Ss=qr,bs=new C.Vector3(0,0,1),Y=new C.Quaternion,xe=new C.Quaternion,W=new C.Euler(0,0,0,"YXZ"),et=class{constructor(t,e,n,r,i){this.humanoid=t,this.rangeMapHorizontalInner=e,this.rangeMapHorizontalOuter=n,this.rangeMapVerticalDown=r,this.rangeMapVerticalUp=i,this.faceFront=new C.Vector3(0,0,1),this._restQuatLeftEye=new C.Quaternion,this._restQuatRightEye=new C.Quaternion,this._restLeftEyeParentWorldQuat=new C.Quaternion,this._restRightEyeParentWorldQuat=new C.Quaternion;let s=this.humanoid.getRawBoneNode("leftEye"),o=this.humanoid.getRawBoneNode("rightEye");s&&(this._restQuatLeftEye.copy(s.quaternion),Pt(s.parent,this._restLeftEyeParentWorldQuat)),o&&(this._restQuatRightEye.copy(o.quaternion),Pt(o.parent,this._restRightEyeParentWorldQuat))}applyYawPitch(t,e){let n=this.humanoid.getRawBoneNode("leftEye"),r=this.humanoid.getRawBoneNode("rightEye"),i=this.humanoid.getNormalizedBoneNode("leftEye"),s=this.humanoid.getNormalizedBoneNode("rightEye");n&&(e<0?W.x=-C.MathUtils.DEG2RAD*this.rangeMapVerticalDown.map(-e):W.x=C.MathUtils.DEG2RAD*this.rangeMapVerticalUp.map(e),t<0?W.y=-C.MathUtils.DEG2RAD*this.rangeMapHorizontalInner.map(-t):W.y=C.MathUtils.DEG2RAD*this.rangeMapHorizontalOuter.map(t),Y.setFromEuler(W),this._getWorldFaceFrontQuat(xe),i.quaternion.copy(xe).multiply(Y).multiply(xe.invert()),Y.copy(this._restLeftEyeParentWorldQuat),n.quaternion.copy(i.quaternion).multiply(Y).premultiply(Y.invert()).multiply(this._restQuatLeftEye)),r&&(e<0?W.x=-C.MathUtils.DEG2RAD*this.rangeMapVerticalDown.map(-e):W.x=C.MathUtils.DEG2RAD*this.rangeMapVerticalUp.map(e),t<0?W.y=-C.MathUtils.DEG2RAD*this.rangeMapHorizontalOuter.map(-t):W.y=C.MathUtils.DEG2RAD*this.rangeMapHorizontalInner.map(t),Y.setFromEuler(W),this._getWorldFaceFrontQuat(xe),s.quaternion.copy(xe).multiply(Y).multiply(xe.invert()),Y.copy(this._restRightEyeParentWorldQuat),r.quaternion.copy(s.quaternion).multiply(Y).premultiply(Y.invert()).multiply(this._restQuatRightEye))}lookAt(t){console.warn("VRMLookAtBoneApplier: lookAt() is deprecated. use apply() instead.");let e=C.MathUtils.RAD2DEG*t.y,n=C.MathUtils.RAD2DEG*t.x;this.applyYawPitch(e,n)}_getWorldFaceFrontQuat(t){if(this.faceFront.distanceToSquared(bs)<.01)return t.identity();let[e,n]=Je(this.faceFront);return W.set(0,.5*Math.PI+e,n,"YZX"),t.setFromEuler(W)}};et.type="bone";var It=class{constructor(t,e,n,r,i){this.expressions=t,this.rangeMapHorizontalInner=e,this.rangeMapHorizontalOuter=n,this.rangeMapVerticalDown=r,this.rangeMapVerticalUp=i}applyYawPitch(t,e){e<0?(this.expressions.setValue("lookDown",0),this.expressions.setValue("lookUp",this.rangeMapVerticalUp.map(-e))):(this.expressions.setValue("lookUp",0),this.expressions.setValue("lookDown",this.rangeMapVerticalDown.map(e))),t<0?(this.expressions.setValue("lookLeft",0),this.expressions.setValue("lookRight",this.rangeMapHorizontalOuter.map(-t))):(this.expressions.setValue("lookRight",0),this.expressions.setValue("lookLeft",this.rangeMapHorizontalOuter.map(t)))}lookAt(t){console.warn("VRMLookAtBoneApplier: lookAt() is deprecated. use apply() instead.");let e=St.MathUtils.RAD2DEG*t.y,n=St.MathUtils.RAD2DEG*t.x;this.applyYawPitch(e,n)}};It.type="expression";var vr=class{constructor(t,e){this.inputMaxValue=t,this.outputScale=e}map(t){return this.outputScale*Ur(t/this.inputMaxValue)}},Ls=new Set(["1.0","1.0-beta"]),Ze=.01,Ps=class{get name(){return"VRMLookAtLoaderPlugin"}constructor(t,e){this.parser=t,this.helperRoot=e?.helperRoot}afterRoot(t){return L(this,null,function*(){let e=t.userData.vrmHumanoid;if(e===null)return;if(e===void 0)throw new Error("VRMLookAtLoaderPlugin: vrmHumanoid is undefined. VRMHumanoidLoaderPlugin have to be used first");let n=t.userData.vrmExpressionManager;if(n!==null){if(n===void 0)throw new Error("VRMLookAtLoaderPlugin: vrmExpressionManager is undefined. VRMExpressionLoaderPlugin have to be used first");t.userData.vrmLookAt=yield this._import(t,e,n)}})}_import(t,e,n){return L(this,null,function*(){if(e==null||n==null)return null;let r=yield this._v1Import(t,e,n);if(r)return r;let i=yield this._v0Import(t,e,n);return i||null})}_v1Import(t,e,n){return L(this,null,function*(){var r,i,s;let o=this.parser.json;if(!(((r=o.extensionsUsed)==null?void 0:r.indexOf("VRMC_vrm"))!==-1))return null;let a=(i=o.extensions)==null?void 0:i.VRMC_vrm;if(!a)return null;let u=a.specVersion;if(!Ls.has(u))return console.warn(`VRMLookAtLoaderPlugin: Unknown VRMC_vrm specVersion "${u}"`),null;let d=a.lookAt;if(!d)return null;let c=d.type==="expression"?1:10,h=this._v1ImportRangeMap(d.rangeMapHorizontalInner,c),p=this._v1ImportRangeMap(d.rangeMapHorizontalOuter,c),m=this._v1ImportRangeMap(d.rangeMapVerticalDown,c),g=this._v1ImportRangeMap(d.rangeMapVerticalUp,c),_;d.type==="expression"?_=new It(n,h,p,m,g):_=new et(e,h,p,m,g);let v=this._importLookAt(e,_);return v.offsetFromHeadBone.fromArray((s=d.offsetFromHeadBone)!=null?s:[0,.06,0]),v})}_v1ImportRangeMap(t,e){var n,r;let i=(n=t?.inputMaxValue)!=null?n:90,s=(r=t?.outputScale)!=null?r:e;return i<Ze&&(console.warn("VRMLookAtLoaderPlugin: inputMaxValue of a range map is too small. Consider reviewing the range map!"),i=Ze),new vr(i,s)}_v0Import(t,e,n){return L(this,null,function*(){var r,i,s,o;let a=(r=this.parser.json.extensions)==null?void 0:r.VRM;if(!a)return null;let u=a.firstPerson;if(!u)return null;let d=u.lookAtTypeName==="BlendShape"?1:10,c=this._v0ImportDegreeMap(u.lookAtHorizontalInner,d),h=this._v0ImportDegreeMap(u.lookAtHorizontalOuter,d),p=this._v0ImportDegreeMap(u.lookAtVerticalDown,d),m=this._v0ImportDegreeMap(u.lookAtVerticalUp,d),g;u.lookAtTypeName==="BlendShape"?g=new It(n,c,h,p,m):g=new et(e,c,h,p,m);let _=this._importLookAt(e,g);return u.firstPersonBoneOffset?_.offsetFromHeadBone.set((i=u.firstPersonBoneOffset.x)!=null?i:0,(s=u.firstPersonBoneOffset.y)!=null?s:.06,-((o=u.firstPersonBoneOffset.z)!=null?o:0)):_.offsetFromHeadBone.set(0,.06,0),_.faceFront.set(0,0,-1),g instanceof et&&g.faceFront.set(0,0,-1),_})}_v0ImportDegreeMap(t,e){var n,r;let i=t?.curve;JSON.stringify(i)!=="[0,0,0,1,1,1,1,0]"&&console.warn("Curves of LookAtDegreeMap defined in VRM 0.0 are not supported");let s=(n=t?.xRange)!=null?n:90,o=(r=t?.yRange)!=null?r:e;return s<Ze&&(console.warn("VRMLookAtLoaderPlugin: xRange of a degree map is too small. Consider reviewing the degree map!"),s=Ze),new vr(s,o)}_importLookAt(t,e){let n=new Ss(t,e);if(this.helperRoot){let r=new Es(n);this.helperRoot.add(r),r.renderOrder=this.helperRoot.renderOrder}return n}};function Is(t,e){return typeof t!="string"||t===""?"":(/^https?:\/\//i.test(e)&&/^\//.test(t)&&(e=e.replace(/(^https?:\/\/[^/]+).*/i,"$1")),/^(https?:)?\/\//i.test(t)||/^data:.*,.*$/i.test(t)||/^blob:.*$/i.test(t)?t:e+t)}var Hs=new Set(["1.0","1.0-beta"]),Ns=class{get name(){return"VRMMetaLoaderPlugin"}constructor(t,e){var n,r,i;this.parser=t,this.needThumbnailImage=(n=e?.needThumbnailImage)!=null?n:!1,this.acceptLicenseUrls=(r=e?.acceptLicenseUrls)!=null?r:["https://vrm.dev/licenses/1.0/"],this.acceptV0Meta=(i=e?.acceptV0Meta)!=null?i:!0}afterRoot(t){return L(this,null,function*(){t.userData.vrmMeta=yield this._import(t)})}_import(t){return L(this,null,function*(){let e=yield this._v1Import(t);if(e!=null)return e;let n=yield this._v0Import(t);return n??null})}_v1Import(t){return L(this,null,function*(){var e,n,r;let i=this.parser.json;if(!(((e=i.extensionsUsed)==null?void 0:e.indexOf("VRMC_vrm"))!==-1))return null;let o=(n=i.extensions)==null?void 0:n.VRMC_vrm;if(o==null)return null;let l=o.specVersion;if(!Hs.has(l))return console.warn(`VRMMetaLoaderPlugin: Unknown VRMC_vrm specVersion "${l}"`),null;let a=o.meta;if(!a)return null;let u=a.licenseUrl;if(!new Set(this.acceptLicenseUrls).has(u))throw new Error(`VRMMetaLoaderPlugin: The license url "${u}" is not accepted`);let c;return this.needThumbnailImage&&a.thumbnailImage!=null&&(c=(r=yield this._extractGLTFImage(a.thumbnailImage))!=null?r:void 0),{metaVersion:"1",name:a.name,version:a.version,authors:a.authors,copyrightInformation:a.copyrightInformation,contactInformation:a.contactInformation,references:a.references,thirdPartyLicenses:a.thirdPartyLicenses,thumbnailImage:c,licenseUrl:a.licenseUrl,avatarPermission:a.avatarPermission,allowExcessivelyViolentUsage:a.allowExcessivelyViolentUsage,allowExcessivelySexualUsage:a.allowExcessivelySexualUsage,commercialUsage:a.commercialUsage,allowPoliticalOrReligiousUsage:a.allowPoliticalOrReligiousUsage,allowAntisocialOrHateUsage:a.allowAntisocialOrHateUsage,creditNotation:a.creditNotation,allowRedistribution:a.allowRedistribution,modification:a.modification,otherLicenseUrl:a.otherLicenseUrl}})}_v0Import(t){return L(this,null,function*(){var e;let r=(e=this.parser.json.extensions)==null?void 0:e.VRM;if(!r)return null;let i=r.meta;if(!i)return null;if(!this.acceptV0Meta)throw new Error("VRMMetaLoaderPlugin: Attempted to load VRM0.0 meta but acceptV0Meta is false");let s;return this.needThumbnailImage&&i.texture!=null&&i.texture!==-1&&(s=yield this.parser.getDependency("texture",i.texture)),{metaVersion:"0",allowedUserName:i.allowedUserName,author:i.author,commercialUssageName:i.commercialUssageName,contactInformation:i.contactInformation,licenseName:i.licenseName,otherLicenseUrl:i.otherLicenseUrl,otherPermissionUrl:i.otherPermissionUrl,reference:i.reference,sexualUssageName:i.sexualUssageName,texture:s??void 0,title:i.title,version:i.version,violentUssageName:i.violentUssageName}})}_extractGLTFImage(t){return L(this,null,function*(){var e;let r=(e=this.parser.json.images)==null?void 0:e[t];if(r==null)return console.warn(`VRMMetaLoaderPlugin: Attempt to use images[${t}] of glTF as a thumbnail but the image doesn't exist`),null;let i=r.uri;if(r.bufferView!=null){let o=yield this.parser.getDependency("bufferView",r.bufferView),l=new Blob([o],{type:r.mimeType});i=URL.createObjectURL(l)}return i==null?(console.warn(`VRMMetaLoaderPlugin: Attempt to use images[${t}] of glTF as a thumbnail but the image couldn't load properly`),null):yield new Or.ImageLoader().loadAsync(Is(i,this.parser.options.path)).catch(o=>(console.error(o),console.warn("VRMMetaLoaderPlugin: Failed to load a thumbnail image"),null))})}},Os=class{constructor(t){this.scene=t.scene,this.meta=t.meta,this.humanoid=t.humanoid,this.expressionManager=t.expressionManager,this.firstPerson=t.firstPerson,this.lookAt=t.lookAt}update(t){this.humanoid.update(),this.lookAt&&this.lookAt.update(t),this.expressionManager&&this.expressionManager.update()}};var Cs=class extends Os{constructor(t){super(t),this.materials=t.materials,this.springBoneManager=t.springBoneManager,this.nodeConstraintManager=t.nodeConstraintManager}update(t){super.update(t),this.nodeConstraintManager&&this.nodeConstraintManager.update(),this.springBoneManager&&this.springBoneManager.update(t),this.materials&&this.materials.forEach(e=>{e.update&&e.update(t)})}},Us=Object.defineProperty,Er=Object.getOwnPropertySymbols,Vs=Object.prototype.hasOwnProperty,Bs=Object.prototype.propertyIsEnumerable,Tr=(t,e,n)=>e in t?Us(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n,Mr=(t,e)=>{for(var n in e||(e={}))Vs.call(e,n)&&Tr(t,n,e[n]);if(Er)for(var n of Er(e))Bs.call(e,n)&&Tr(t,n,e[n]);return t},ve=(t,e,n)=>new Promise((r,i)=>{var s=a=>{try{l(n.next(a))}catch(u){i(u)}},o=a=>{try{l(n.throw(a))}catch(u){i(u)}},l=a=>a.done?r(a.value):Promise.resolve(a.value).then(s,o);l((n=n.apply(t,e)).next())}),Ds={"":3e3,srgb:3001};function Fs(t,e){parseInt(Kr.REVISION,10)>=152?t.colorSpace=e:t.encoding=Ds[e]}var ks=class{get pending(){return Promise.all(this._pendings)}constructor(t,e){this._parser=t,this._materialParams=e,this._pendings=[]}assignPrimitive(t,e){e!=null&&(this._materialParams[t]=e)}assignColor(t,e,n){if(e!=null){let r=new Qr.Color().fromArray(e);n&&r.convertSRGBToLinear(),this._materialParams[t]=r}}assignTexture(t,e,n){return ve(this,null,function*(){let r=ve(this,null,function*(){if(e!=null){let i=yield this._parser.assignTexture(this._materialParams,t,e);if(i==null){console.warn("GLTFMToonMaterialParamsAssignHelper: Failed to load texture. The rendering result may be wrong");return}n&&Fs(i,"srgb")}});return this._pendings.push(r),r})}assignTextureByIndex(t,e,n){return ve(this,null,function*(){return this.assignTexture(t,e!=null?{index:e}:void 0,n)})}},Ws=`// #define PHONG

varying vec3 vViewPosition;

#ifndef FLAT_SHADED
  varying vec3 vNormal;
#endif

#include <common>

// #include <uv_pars_vertex>
#ifdef MTOON_USE_UV
  varying vec2 vUv;

  // COMPAT: pre-r151 uses a common uvTransform
  #if THREE_VRM_THREE_REVISION < 151
    uniform mat3 uvTransform;
  #endif
#endif

// #include <uv2_pars_vertex>
// COMAPT: pre-r151 uses uv2 for lightMap and aoMap
#if THREE_VRM_THREE_REVISION < 151
  #if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
    attribute vec2 uv2;
    varying vec2 vUv2;
    uniform mat3 uv2Transform;
  #endif
#endif

// #include <displacementmap_pars_vertex>
// #include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

#ifdef USE_OUTLINEWIDTHMULTIPLYTEXTURE
  uniform sampler2D outlineWidthMultiplyTexture;
  uniform mat3 outlineWidthMultiplyTextureUvTransform;
#endif

uniform float outlineWidthFactor;

void main() {

  // #include <uv_vertex>
  #ifdef MTOON_USE_UV
    // COMPAT: pre-r151 uses a common uvTransform
    #if THREE_VRM_THREE_REVISION >= 151
      vUv = uv;
    #else
      vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
    #endif
  #endif

  // #include <uv2_vertex>
  // COMAPT: pre-r151 uses uv2 for lightMap and aoMap
  #if THREE_VRM_THREE_REVISION < 151
    #if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
      vUv2 = ( uv2Transform * vec3( uv2, 1 ) ).xy;
    #endif
  #endif

  #include <color_vertex>

  #include <beginnormal_vertex>
  #include <morphnormal_vertex>
  #include <skinbase_vertex>
  #include <skinnormal_vertex>

  // we need this to compute the outline properly
  objectNormal = normalize( objectNormal );

  #include <defaultnormal_vertex>

  #ifndef FLAT_SHADED // Normal computed with derivatives when FLAT_SHADED
    vNormal = normalize( transformedNormal );
  #endif

  #include <begin_vertex>

  #include <morphtarget_vertex>
  #include <skinning_vertex>
  // #include <displacementmap_vertex>
  #include <project_vertex>
  #include <logdepthbuf_vertex>
  #include <clipping_planes_vertex>

  vViewPosition = - mvPosition.xyz;

  #ifdef OUTLINE
    float worldNormalLength = length( transformedNormal );
    vec3 outlineOffset = outlineWidthFactor * worldNormalLength * objectNormal;

    #ifdef USE_OUTLINEWIDTHMULTIPLYTEXTURE
      vec2 outlineWidthMultiplyTextureUv = ( outlineWidthMultiplyTextureUvTransform * vec3( vUv, 1 ) ).xy;
      float outlineTex = texture2D( outlineWidthMultiplyTexture, outlineWidthMultiplyTextureUv ).g;
      outlineOffset *= outlineTex;
    #endif

    #ifdef OUTLINE_WIDTH_SCREEN
      outlineOffset *= vViewPosition.z / projectionMatrix[ 1 ].y;
    #endif

    gl_Position = projectionMatrix * modelViewMatrix * vec4( outlineOffset + transformed, 1.0 );

    gl_Position.z += 1E-6 * gl_Position.w; // anti-artifact magic
  #endif

  #include <worldpos_vertex>
  // #include <envmap_vertex>
  #include <shadowmap_vertex>
  #include <fog_vertex>

}`,Gs=`// #define PHONG

uniform vec3 litFactor;

uniform float opacity;

uniform vec3 shadeColorFactor;
#ifdef USE_SHADEMULTIPLYTEXTURE
  uniform sampler2D shadeMultiplyTexture;
  uniform mat3 shadeMultiplyTextureUvTransform;
#endif

uniform float shadingShiftFactor;
uniform float shadingToonyFactor;

#ifdef USE_SHADINGSHIFTTEXTURE
  uniform sampler2D shadingShiftTexture;
  uniform mat3 shadingShiftTextureUvTransform;
  uniform float shadingShiftTextureScale;
#endif

uniform float giEqualizationFactor;

uniform vec3 parametricRimColorFactor;
#ifdef USE_RIMMULTIPLYTEXTURE
  uniform sampler2D rimMultiplyTexture;
  uniform mat3 rimMultiplyTextureUvTransform;
#endif
uniform float rimLightingMixFactor;
uniform float parametricRimFresnelPowerFactor;
uniform float parametricRimLiftFactor;

#ifdef USE_MATCAPTEXTURE
  uniform vec3 matcapFactor;
  uniform sampler2D matcapTexture;
  uniform mat3 matcapTextureUvTransform;
#endif

uniform vec3 emissive;
uniform float emissiveIntensity;

uniform vec3 outlineColorFactor;
uniform float outlineLightingMixFactor;

#ifdef USE_UVANIMATIONMASKTEXTURE
  uniform sampler2D uvAnimationMaskTexture;
  uniform mat3 uvAnimationMaskTextureUvTransform;
#endif

uniform float uvAnimationScrollXOffset;
uniform float uvAnimationScrollYOffset;
uniform float uvAnimationRotationPhase;

#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>

// #include <uv_pars_fragment>
#if ( defined( MTOON_USE_UV ) && !defined( MTOON_UVS_VERTEX_ONLY ) )
  varying vec2 vUv;
#endif

// #include <uv2_pars_fragment>
// COMAPT: pre-r151 uses uv2 for lightMap and aoMap
#if THREE_VRM_THREE_REVISION < 151
  #if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
    varying vec2 vUv2;
  #endif
#endif

#include <map_pars_fragment>

#ifdef USE_MAP
  uniform mat3 mapUvTransform;
#endif

// #include <alphamap_pars_fragment>

#include <alphatest_pars_fragment>

#include <aomap_pars_fragment>
// #include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>

#ifdef USE_EMISSIVEMAP
  uniform mat3 emissiveMapUvTransform;
#endif

// #include <envmap_common_pars_fragment>
// #include <envmap_pars_fragment>
// #include <cube_uv_reflection_fragment>
#include <fog_pars_fragment>

// #include <bsdfs>
// COMPAT: pre-r151 doesn't have BRDF_Lambert in <common>
#if THREE_VRM_THREE_REVISION < 151
  vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
    return RECIPROCAL_PI * diffuseColor;
  }
#endif

#include <lights_pars_begin>

#include <normal_pars_fragment>

// #include <lights_phong_pars_fragment>
varying vec3 vViewPosition;

struct MToonMaterial {
  vec3 diffuseColor;
  vec3 shadeColor;
  float shadingShift;
};

float linearstep( float a, float b, float t ) {
  return clamp( ( t - a ) / ( b - a ), 0.0, 1.0 );
}

/**
 * Convert NdotL into toon shading factor using shadingShift and shadingToony
 */
float getShading(
  const in float dotNL,
  const in float shadow,
  const in float shadingShift
) {
  float shading = dotNL;
  shading = shading + shadingShift;
  shading = linearstep( -1.0 + shadingToonyFactor, 1.0 - shadingToonyFactor, shading );
  shading *= shadow;
  return shading;
}

/**
 * Mix diffuseColor and shadeColor using shading factor and light color
 */
vec3 getDiffuse(
  const in MToonMaterial material,
  const in float shading,
  in vec3 lightColor
) {
  #ifdef DEBUG_LITSHADERATE
    return vec3( BRDF_Lambert( shading * lightColor ) );
  #endif

  vec3 col = lightColor * BRDF_Lambert( mix( material.shadeColor, material.diffuseColor, shading ) );

  // The "comment out if you want to PBR absolutely" line
  #ifdef V0_COMPAT_SHADE
    col = min( col, material.diffuseColor );
  #endif

  return col;
}

// COMPAT: pre-r156 uses a struct GeometricContext
#if THREE_VRM_THREE_REVISION >= 157
  void RE_Direct_MToon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in MToonMaterial material, const in float shadow, inout ReflectedLight reflectedLight ) {
    float dotNL = clamp( dot( geometryNormal, directLight.direction ), -1.0, 1.0 );
    vec3 irradiance = directLight.color;

    // directSpecular will be used for rim lighting, not an actual specular
    reflectedLight.directSpecular += irradiance;

    irradiance *= dotNL;

    float shading = getShading( dotNL, shadow, material.shadingShift );

    // toon shaded diffuse
    reflectedLight.directDiffuse += getDiffuse( material, shading, directLight.color );
  }

  void RE_IndirectDiffuse_MToon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in MToonMaterial material, inout ReflectedLight reflectedLight ) {
    // indirect diffuse will use diffuseColor, no shadeColor involved
    reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );

    // directSpecular will be used for rim lighting, not an actual specular
    reflectedLight.directSpecular += irradiance;
  }
#else
  void RE_Direct_MToon( const in IncidentLight directLight, const in GeometricContext geometry, const in MToonMaterial material, const in float shadow, inout ReflectedLight reflectedLight ) {
    float dotNL = clamp( dot( geometry.normal, directLight.direction ), -1.0, 1.0 );
    vec3 irradiance = directLight.color;

    // directSpecular will be used for rim lighting, not an actual specular
    reflectedLight.directSpecular += irradiance;

    irradiance *= dotNL;

    float shading = getShading( dotNL, shadow, material.shadingShift );

    // toon shaded diffuse
    reflectedLight.directDiffuse += getDiffuse( material, shading, directLight.color );
  }

  void RE_IndirectDiffuse_MToon( const in vec3 irradiance, const in GeometricContext geometry, const in MToonMaterial material, inout ReflectedLight reflectedLight ) {
    // indirect diffuse will use diffuseColor, no shadeColor involved
    reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );

    // directSpecular will be used for rim lighting, not an actual specular
    reflectedLight.directSpecular += irradiance;
  }
#endif

#define RE_Direct RE_Direct_MToon
#define RE_IndirectDiffuse RE_IndirectDiffuse_MToon
#define Material_LightProbeLOD( material ) (0)

#include <shadowmap_pars_fragment>
// #include <bumpmap_pars_fragment>

// #include <normalmap_pars_fragment>
#ifdef USE_NORMALMAP

  uniform sampler2D normalMap;
  uniform mat3 normalMapUvTransform;
  uniform vec2 normalScale;

#endif

// COMPAT: pre-r151
// USE_NORMALMAP_OBJECTSPACE used to be OBJECTSPACE_NORMALMAP in pre-r151
#if defined( USE_NORMALMAP_OBJECTSPACE ) || defined( OBJECTSPACE_NORMALMAP )

  uniform mat3 normalMatrix;

#endif

// COMPAT: pre-r151
// USE_NORMALMAP_TANGENTSPACE used to be TANGENTSPACE_NORMALMAP in pre-r151
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( TANGENTSPACE_NORMALMAP ) )

  // Per-Pixel Tangent Space Normal Mapping
  // http://hacksoflife.blogspot.ch/2009/11/per-pixel-tangent-space-normal-mapping.html

  // three-vrm specific change: it requires \`uv\` as an input in order to support uv scrolls

  // Temporary compat against shader change @ Three.js r126, r151
  #if THREE_VRM_THREE_REVISION >= 151

    mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {

      vec3 q0 = dFdx( eye_pos.xyz );
      vec3 q1 = dFdy( eye_pos.xyz );
      vec2 st0 = dFdx( uv.st );
      vec2 st1 = dFdy( uv.st );

      vec3 N = surf_norm;

      vec3 q1perp = cross( q1, N );
      vec3 q0perp = cross( N, q0 );

      vec3 T = q1perp * st0.x + q0perp * st1.x;
      vec3 B = q1perp * st0.y + q0perp * st1.y;

      float det = max( dot( T, T ), dot( B, B ) );
      float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );

      return mat3( T * scale, B * scale, N );

    }

  #else

    vec3 perturbNormal2Arb( vec2 uv, vec3 eye_pos, vec3 surf_norm, vec3 mapN, float faceDirection ) {

      vec3 q0 = vec3( dFdx( eye_pos.x ), dFdx( eye_pos.y ), dFdx( eye_pos.z ) );
      vec3 q1 = vec3( dFdy( eye_pos.x ), dFdy( eye_pos.y ), dFdy( eye_pos.z ) );
      vec2 st0 = dFdx( uv.st );
      vec2 st1 = dFdy( uv.st );

      vec3 N = normalize( surf_norm );

      vec3 q1perp = cross( q1, N );
      vec3 q0perp = cross( N, q0 );

      vec3 T = q1perp * st0.x + q0perp * st1.x;
      vec3 B = q1perp * st0.y + q0perp * st1.y;

      // three-vrm specific change: Workaround for the issue that happens when delta of uv = 0.0
      // TODO: Is this still required? Or shall I make a PR about it?
      if ( length( T ) == 0.0 || length( B ) == 0.0 ) {
        return surf_norm;
      }

      float det = max( dot( T, T ), dot( B, B ) );
      float scale = ( det == 0.0 ) ? 0.0 : faceDirection * inversesqrt( det );

      return normalize( T * ( mapN.x * scale ) + B * ( mapN.y * scale ) + N * mapN.z );

    }

  #endif

#endif

// #include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

// == post correction ==========================================================
void postCorrection() {
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  #include <fog_fragment>
  #include <premultiplied_alpha_fragment>
  #include <dithering_fragment>
}

// == main procedure ===========================================================
void main() {
  #include <clipping_planes_fragment>

  vec2 uv = vec2(0.5, 0.5);

  #if ( defined( MTOON_USE_UV ) && !defined( MTOON_UVS_VERTEX_ONLY ) )
    uv = vUv;

    float uvAnimMask = 1.0;
    #ifdef USE_UVANIMATIONMASKTEXTURE
      vec2 uvAnimationMaskTextureUv = ( uvAnimationMaskTextureUvTransform * vec3( uv, 1 ) ).xy;
      uvAnimMask = texture2D( uvAnimationMaskTexture, uvAnimationMaskTextureUv ).b;
    #endif

    float uvRotCos = cos( uvAnimationRotationPhase * uvAnimMask );
    float uvRotSin = sin( uvAnimationRotationPhase * uvAnimMask );
    uv = mat2( uvRotCos, -uvRotSin, uvRotSin, uvRotCos ) * ( uv - 0.5 ) + 0.5;
    uv = uv + vec2( uvAnimationScrollXOffset, uvAnimationScrollYOffset ) * uvAnimMask;
  #endif

  #ifdef DEBUG_UV
    gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
    #if ( defined( MTOON_USE_UV ) && !defined( MTOON_UVS_VERTEX_ONLY ) )
      gl_FragColor = vec4( uv, 0.0, 1.0 );
    #endif
    return;
  #endif

  vec4 diffuseColor = vec4( litFactor, opacity );
  ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
  vec3 totalEmissiveRadiance = emissive * emissiveIntensity;

  #include <logdepthbuf_fragment>

  // #include <map_fragment>
  #ifdef USE_MAP
    vec2 mapUv = ( mapUvTransform * vec3( uv, 1 ) ).xy;
    vec4 sampledDiffuseColor = texture2D( map, mapUv );
    #ifdef DECODE_VIDEO_TEXTURE
      sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
    #endif
    diffuseColor *= sampledDiffuseColor;
  #endif

  // #include <color_fragment>
  #if ( defined( USE_COLOR ) && !defined( IGNORE_VERTEX_COLOR ) )
    diffuseColor.rgb *= vColor;
  #endif

  // #include <alphamap_fragment>

  #include <alphatest_fragment>

  // #include <specularmap_fragment>

  // #include <normal_fragment_begin>
  float faceDirection = gl_FrontFacing ? 1.0 : -1.0;

  #ifdef FLAT_SHADED

    vec3 fdx = dFdx( vViewPosition );
    vec3 fdy = dFdy( vViewPosition );
    vec3 normal = normalize( cross( fdx, fdy ) );

  #else

    vec3 normal = normalize( vNormal );

    #ifdef DOUBLE_SIDED

      normal *= faceDirection;

    #endif

  #endif

  #ifdef USE_NORMALMAP

    vec2 normalMapUv = ( normalMapUvTransform * vec3( uv, 1 ) ).xy;

  #endif

  #ifdef USE_NORMALMAP_TANGENTSPACE

    #ifdef USE_TANGENT

      mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );

    #else

      mat3 tbn = getTangentFrame( - vViewPosition, normal, normalMapUv );

    #endif

    #if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )

      tbn[0] *= faceDirection;
      tbn[1] *= faceDirection;

    #endif

  #endif

  #ifdef USE_CLEARCOAT_NORMALMAP

    #ifdef USE_TANGENT

      mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );

    #else

      mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );

    #endif

    #if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )

      tbn2[0] *= faceDirection;
      tbn2[1] *= faceDirection;

    #endif

  #endif

  // non perturbed normal for clearcoat among others

  vec3 nonPerturbedNormal = normal;

  #ifdef OUTLINE
    normal *= -1.0;
  #endif

  // #include <normal_fragment_maps>

  // COMPAT: pre-r151
  // USE_NORMALMAP_OBJECTSPACE used to be OBJECTSPACE_NORMALMAP in pre-r151
  #if defined( USE_NORMALMAP_OBJECTSPACE ) || defined( OBJECTSPACE_NORMALMAP )

    normal = texture2D( normalMap, normalMapUv ).xyz * 2.0 - 1.0; // overrides both flatShading and attribute normals

    #ifdef FLIP_SIDED

      normal = - normal;

    #endif

    #ifdef DOUBLE_SIDED

      normal = normal * faceDirection;

    #endif

    normal = normalize( normalMatrix * normal );

  // COMPAT: pre-r151
  // USE_NORMALMAP_TANGENTSPACE used to be TANGENTSPACE_NORMALMAP in pre-r151
  #elif defined( USE_NORMALMAP_TANGENTSPACE ) || defined( TANGENTSPACE_NORMALMAP )

    vec3 mapN = texture2D( normalMap, normalMapUv ).xyz * 2.0 - 1.0;
    mapN.xy *= normalScale;

    // COMPAT: pre-r151
    #if THREE_VRM_THREE_REVISION >= 151 || defined( USE_TANGENT )

      normal = normalize( tbn * mapN );

    #else

      normal = perturbNormal2Arb( uv, -vViewPosition, normal, mapN, faceDirection );

    #endif

  #endif

  // #include <emissivemap_fragment>
  #ifdef USE_EMISSIVEMAP
    vec2 emissiveMapUv = ( emissiveMapUvTransform * vec3( uv, 1 ) ).xy;
    totalEmissiveRadiance *= texture2D( emissiveMap, emissiveMapUv ).rgb;
  #endif

  #ifdef DEBUG_NORMAL
    gl_FragColor = vec4( 0.5 + 0.5 * normal, 1.0 );
    return;
  #endif

  // -- MToon: lighting --------------------------------------------------------
  // accumulation
  // #include <lights_phong_fragment>
  MToonMaterial material;

  material.diffuseColor = diffuseColor.rgb;

  material.shadeColor = shadeColorFactor;
  #ifdef USE_SHADEMULTIPLYTEXTURE
    vec2 shadeMultiplyTextureUv = ( shadeMultiplyTextureUvTransform * vec3( uv, 1 ) ).xy;
    material.shadeColor *= texture2D( shadeMultiplyTexture, shadeMultiplyTextureUv ).rgb;
  #endif

  #if ( defined( USE_COLOR ) && !defined( IGNORE_VERTEX_COLOR ) )
    material.shadeColor.rgb *= vColor;
  #endif

  material.shadingShift = shadingShiftFactor;
  #ifdef USE_SHADINGSHIFTTEXTURE
    vec2 shadingShiftTextureUv = ( shadingShiftTextureUvTransform * vec3( uv, 1 ) ).xy;
    material.shadingShift += texture2D( shadingShiftTexture, shadingShiftTextureUv ).r * shadingShiftTextureScale;
  #endif

  // #include <lights_fragment_begin>

  // MToon Specific changes:
  // Since we want to take shadows into account of shading instead of irradiance,
  // we had to modify the codes that multiplies the results of shadowmap into color of direct lights.

  // COMPAT: pre-r156 uses a struct GeometricContext
  #if THREE_VRM_THREE_REVISION >= 157
    vec3 geometryPosition = - vViewPosition;
    vec3 geometryNormal = normal;
    vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );

    vec3 geometryClearcoatNormal;

    #ifdef USE_CLEARCOAT

      geometryClearcoatNormal = clearcoatNormal;

    #endif
  #else
    GeometricContext geometry;

    geometry.position = - vViewPosition;
    geometry.normal = normal;
    geometry.viewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );

    #ifdef USE_CLEARCOAT

      geometry.clearcoatNormal = clearcoatNormal;

    #endif
  #endif

  IncidentLight directLight;

  // since these variables will be used in unrolled loop, we have to define in prior
  float shadow;

  #if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )

    PointLight pointLight;
    #if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
    PointLightShadow pointLightShadow;
    #endif

    #pragma unroll_loop_start
    for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {

      pointLight = pointLights[ i ];

      // COMPAT: pre-r156 uses a struct GeometricContext
      #if THREE_VRM_THREE_REVISION >= 157
        getPointLightInfo( pointLight, geometryPosition, directLight );
      #else
        getPointLightInfo( pointLight, geometry, directLight );
      #endif

      shadow = 1.0;
      #if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
      pointLightShadow = pointLightShadows[ i ];
      // COMPAT: pre-r166
      // r166 introduced shadowIntensity
      #if THREE_VRM_THREE_REVISION >= 166
        shadow = all( bvec2( directLight.visible, receiveShadow ) ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
      #else
        shadow = all( bvec2( directLight.visible, receiveShadow ) ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
      #endif
      #endif

      // COMPAT: pre-r156 uses a struct GeometricContext
      #if THREE_VRM_THREE_REVISION >= 157
        RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, shadow, reflectedLight );
      #else
        RE_Direct( directLight, geometry, material, shadow, reflectedLight );
      #endif

    }
    #pragma unroll_loop_end

  #endif

  #if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )

    SpotLight spotLight;
    // COMPAT: pre-r144 uses NUM_SPOT_LIGHT_SHADOWS, r144+ uses NUM_SPOT_LIGHT_COORDS
    #if THREE_VRM_THREE_REVISION >= 144
      #if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_COORDS > 0
      SpotLightShadow spotLightShadow;
      #endif
    #elif defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
    SpotLightShadow spotLightShadow;
    #endif

    #pragma unroll_loop_start
    for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {

      spotLight = spotLights[ i ];

      // COMPAT: pre-r156 uses a struct GeometricContext
      #if THREE_VRM_THREE_REVISION >= 157
        getSpotLightInfo( spotLight, geometryPosition, directLight );
      #else
        getSpotLightInfo( spotLight, geometry, directLight );
      #endif

      shadow = 1.0;
      // COMPAT: pre-r144 uses NUM_SPOT_LIGHT_SHADOWS and vSpotShadowCoord, r144+ uses NUM_SPOT_LIGHT_COORDS and vSpotLightCoord
      // COMPAT: pre-r166 does not have shadowIntensity, r166+ has shadowIntensity
      #if THREE_VRM_THREE_REVISION >= 166
        #if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_COORDS )
        spotLightShadow = spotLightShadows[ i ];
        shadow = all( bvec2( directLight.visible, receiveShadow ) ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
        #endif
      #elif THREE_VRM_THREE_REVISION >= 144
        #if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_COORDS )
        spotLightShadow = spotLightShadows[ i ];
        shadow = all( bvec2( directLight.visible, receiveShadow ) ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
        #endif
      #elif defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
      spotLightShadow = spotLightShadows[ i ];
      shadow = all( bvec2( directLight.visible, receiveShadow ) ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotShadowCoord[ i ] ) : 1.0;
      #endif

      // COMPAT: pre-r156 uses a struct GeometricContext
      #if THREE_VRM_THREE_REVISION >= 157
        RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, shadow, reflectedLight );
      #else
        RE_Direct( directLight, geometry, material, shadow, reflectedLight );
      #endif

    }
    #pragma unroll_loop_end

  #endif

  #if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )

    DirectionalLight directionalLight;
    #if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
    DirectionalLightShadow directionalLightShadow;
    #endif

    #pragma unroll_loop_start
    for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {

      directionalLight = directionalLights[ i ];

      // COMPAT: pre-r156 uses a struct GeometricContext
      #if THREE_VRM_THREE_REVISION >= 157
        getDirectionalLightInfo( directionalLight, directLight );
      #else
        getDirectionalLightInfo( directionalLight, geometry, directLight );
      #endif

      shadow = 1.0;
      #if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
      directionalLightShadow = directionalLightShadows[ i ];
      // COMPAT: pre-r166
      // r166 introduced shadowIntensity
      #if THREE_VRM_THREE_REVISION >= 166
        shadow = all( bvec2( directLight.visible, receiveShadow ) ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
      #else
        shadow = all( bvec2( directLight.visible, receiveShadow ) ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
      #endif
      #endif

      // COMPAT: pre-r156 uses a struct GeometricContext
      #if THREE_VRM_THREE_REVISION >= 157
        RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, shadow, reflectedLight );
      #else
        RE_Direct( directLight, geometry, material, shadow, reflectedLight );
      #endif

    }
    #pragma unroll_loop_end

  #endif

  // #if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )

  //   RectAreaLight rectAreaLight;

  //   #pragma unroll_loop_start
  //   for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {

  //     rectAreaLight = rectAreaLights[ i ];
  //     RE_Direct_RectArea( rectAreaLight, geometry, material, reflectedLight );

  //   }
  //   #pragma unroll_loop_end

  // #endif

  #if defined( RE_IndirectDiffuse )

    vec3 iblIrradiance = vec3( 0.0 );

    vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );

    // COMPAT: pre-r156 uses a struct GeometricContext
    // COMPAT: pre-r156 doesn't have a define USE_LIGHT_PROBES
    #if THREE_VRM_THREE_REVISION >= 157
      #if defined( USE_LIGHT_PROBES )
        irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
      #endif
    #else
      irradiance += getLightProbeIrradiance( lightProbe, geometry.normal );
    #endif

    #if ( NUM_HEMI_LIGHTS > 0 )

      #pragma unroll_loop_start
      for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {

        // COMPAT: pre-r156 uses a struct GeometricContext
        #if THREE_VRM_THREE_REVISION >= 157
          irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
        #else
          irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry.normal );
        #endif

      }
      #pragma unroll_loop_end

    #endif

  #endif

  // #if defined( RE_IndirectSpecular )

  //   vec3 radiance = vec3( 0.0 );
  //   vec3 clearcoatRadiance = vec3( 0.0 );

  // #endif

  #include <lights_fragment_maps>
  #include <lights_fragment_end>

  // modulation
  #include <aomap_fragment>

  vec3 col = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;

  #ifdef DEBUG_LITSHADERATE
    gl_FragColor = vec4( col, diffuseColor.a );
    postCorrection();
    return;
  #endif

  // -- MToon: rim lighting -----------------------------------------
  vec3 viewDir = normalize( vViewPosition );

  #ifndef PHYSICALLY_CORRECT_LIGHTS
    reflectedLight.directSpecular /= PI;
  #endif
  vec3 rimMix = mix( vec3( 1.0 ), reflectedLight.directSpecular, rimLightingMixFactor );

  vec3 rim = parametricRimColorFactor * pow( saturate( 1.0 - dot( viewDir, normal ) + parametricRimLiftFactor ), parametricRimFresnelPowerFactor );

  #ifdef USE_MATCAPTEXTURE
    {
      vec3 x = normalize( vec3( viewDir.z, 0.0, -viewDir.x ) );
      vec3 y = cross( viewDir, x ); // guaranteed to be normalized
      vec2 sphereUv = 0.5 + 0.5 * vec2( dot( x, normal ), -dot( y, normal ) );
      sphereUv = ( matcapTextureUvTransform * vec3( sphereUv, 1 ) ).xy;
      vec3 matcap = texture2D( matcapTexture, sphereUv ).rgb;
      rim += matcapFactor * matcap;
    }
  #endif

  #ifdef USE_RIMMULTIPLYTEXTURE
    vec2 rimMultiplyTextureUv = ( rimMultiplyTextureUvTransform * vec3( uv, 1 ) ).xy;
    rim *= texture2D( rimMultiplyTexture, rimMultiplyTextureUv ).rgb;
  #endif

  col += rimMix * rim;

  // -- MToon: Emission --------------------------------------------------------
  col += totalEmissiveRadiance;

  // #include <envmap_fragment>

  // -- Almost done! -----------------------------------------------------------
  #if defined( OUTLINE )
    col = outlineColorFactor.rgb * mix( vec3( 1.0 ), col, outlineLightingMixFactor );
  #endif

  #ifdef OPAQUE
    diffuseColor.a = 1.0;
  #endif

  gl_FragColor = vec4( col, diffuseColor.a );
  postCorrection();
}
`,zs={None:"none",Normal:"normal",LitShadeRate:"litShadeRate",UV:"uv"},Rr={None:"none",WorldCoordinates:"worldCoordinates",ScreenCoordinates:"screenCoordinates"},js={3e3:"",3001:"srgb"};function Tt(t){return parseInt(Zr.REVISION,10)>=152?t.colorSpace:js[t.encoding]}var Vt=class extends P.ShaderMaterial{constructor(t={}){var e;super({vertexShader:Ws,fragmentShader:Gs}),this.uvAnimationScrollXSpeedFactor=0,this.uvAnimationScrollYSpeedFactor=0,this.uvAnimationRotationSpeedFactor=0,this.fog=!0,this.normalMapType=P.TangentSpaceNormalMap,this._ignoreVertexColor=!0,this._v0CompatShade=!1,this._debugMode=zs.None,this._outlineWidthMode=Rr.None,this._isOutline=!1,t.transparentWithZWrite&&(t.depthWrite=!0),delete t.transparentWithZWrite,t.fog=!0,t.lights=!0,t.clipping=!0,this.uniforms=P.UniformsUtils.merge([P.UniformsLib.common,P.UniformsLib.normalmap,P.UniformsLib.emissivemap,P.UniformsLib.fog,P.UniformsLib.lights,{litFactor:{value:new P.Color(1,1,1)},mapUvTransform:{value:new P.Matrix3},colorAlpha:{value:1},normalMapUvTransform:{value:new P.Matrix3},shadeColorFactor:{value:new P.Color(0,0,0)},shadeMultiplyTexture:{value:null},shadeMultiplyTextureUvTransform:{value:new P.Matrix3},shadingShiftFactor:{value:0},shadingShiftTexture:{value:null},shadingShiftTextureUvTransform:{value:new P.Matrix3},shadingShiftTextureScale:{value:1},shadingToonyFactor:{value:.9},giEqualizationFactor:{value:.9},matcapFactor:{value:new P.Color(1,1,1)},matcapTexture:{value:null},matcapTextureUvTransform:{value:new P.Matrix3},parametricRimColorFactor:{value:new P.Color(0,0,0)},rimMultiplyTexture:{value:null},rimMultiplyTextureUvTransform:{value:new P.Matrix3},rimLightingMixFactor:{value:1},parametricRimFresnelPowerFactor:{value:5},parametricRimLiftFactor:{value:0},emissive:{value:new P.Color(0,0,0)},emissiveIntensity:{value:1},emissiveMapUvTransform:{value:new P.Matrix3},outlineWidthMultiplyTexture:{value:null},outlineWidthMultiplyTextureUvTransform:{value:new P.Matrix3},outlineWidthFactor:{value:0},outlineColorFactor:{value:new P.Color(0,0,0)},outlineLightingMixFactor:{value:1},uvAnimationMaskTexture:{value:null},uvAnimationMaskTextureUvTransform:{value:new P.Matrix3},uvAnimationScrollXOffset:{value:0},uvAnimationScrollYOffset:{value:0},uvAnimationRotationPhase:{value:0}},(e=t.uniforms)!=null?e:{}]),this.setValues(t),this._uploadUniformsWorkaround(),this.customProgramCacheKey=()=>[...Object.entries(this._generateDefines()).map(([n,r])=>`${n}:${r}`),this.matcapTexture?`matcapTextureColorSpace:${Tt(this.matcapTexture)}`:"",this.shadeMultiplyTexture?`shadeMultiplyTextureColorSpace:${Tt(this.shadeMultiplyTexture)}`:"",this.rimMultiplyTexture?`rimMultiplyTextureColorSpace:${Tt(this.rimMultiplyTexture)}`:""].join(","),this.onBeforeCompile=n=>{let r=parseInt(P.REVISION,10),i=Object.entries(Mr(Mr({},this._generateDefines()),this.defines)).filter(([s,o])=>!!o).map(([s,o])=>`#define ${s} ${o}`).join(`
`)+`
`;n.vertexShader=i+n.vertexShader,n.fragmentShader=i+n.fragmentShader,r<154&&(n.fragmentShader=n.fragmentShader.replace("#include <colorspace_fragment>","#include <encodings_fragment>"))}}get color(){return this.uniforms.litFactor.value}set color(t){this.uniforms.litFactor.value=t}get map(){return this.uniforms.map.value}set map(t){this.uniforms.map.value=t}get normalMap(){return this.uniforms.normalMap.value}set normalMap(t){this.uniforms.normalMap.value=t}get normalScale(){return this.uniforms.normalScale.value}set normalScale(t){this.uniforms.normalScale.value=t}get emissive(){return this.uniforms.emissive.value}set emissive(t){this.uniforms.emissive.value=t}get emissiveIntensity(){return this.uniforms.emissiveIntensity.value}set emissiveIntensity(t){this.uniforms.emissiveIntensity.value=t}get emissiveMap(){return this.uniforms.emissiveMap.value}set emissiveMap(t){this.uniforms.emissiveMap.value=t}get shadeColorFactor(){return this.uniforms.shadeColorFactor.value}set shadeColorFactor(t){this.uniforms.shadeColorFactor.value=t}get shadeMultiplyTexture(){return this.uniforms.shadeMultiplyTexture.value}set shadeMultiplyTexture(t){this.uniforms.shadeMultiplyTexture.value=t}get shadingShiftFactor(){return this.uniforms.shadingShiftFactor.value}set shadingShiftFactor(t){this.uniforms.shadingShiftFactor.value=t}get shadingShiftTexture(){return this.uniforms.shadingShiftTexture.value}set shadingShiftTexture(t){this.uniforms.shadingShiftTexture.value=t}get shadingShiftTextureScale(){return this.uniforms.shadingShiftTextureScale.value}set shadingShiftTextureScale(t){this.uniforms.shadingShiftTextureScale.value=t}get shadingToonyFactor(){return this.uniforms.shadingToonyFactor.value}set shadingToonyFactor(t){this.uniforms.shadingToonyFactor.value=t}get giEqualizationFactor(){return this.uniforms.giEqualizationFactor.value}set giEqualizationFactor(t){this.uniforms.giEqualizationFactor.value=t}get matcapFactor(){return this.uniforms.matcapFactor.value}set matcapFactor(t){this.uniforms.matcapFactor.value=t}get matcapTexture(){return this.uniforms.matcapTexture.value}set matcapTexture(t){this.uniforms.matcapTexture.value=t}get parametricRimColorFactor(){return this.uniforms.parametricRimColorFactor.value}set parametricRimColorFactor(t){this.uniforms.parametricRimColorFactor.value=t}get rimMultiplyTexture(){return this.uniforms.rimMultiplyTexture.value}set rimMultiplyTexture(t){this.uniforms.rimMultiplyTexture.value=t}get rimLightingMixFactor(){return this.uniforms.rimLightingMixFactor.value}set rimLightingMixFactor(t){this.uniforms.rimLightingMixFactor.value=t}get parametricRimFresnelPowerFactor(){return this.uniforms.parametricRimFresnelPowerFactor.value}set parametricRimFresnelPowerFactor(t){this.uniforms.parametricRimFresnelPowerFactor.value=t}get parametricRimLiftFactor(){return this.uniforms.parametricRimLiftFactor.value}set parametricRimLiftFactor(t){this.uniforms.parametricRimLiftFactor.value=t}get outlineWidthMultiplyTexture(){return this.uniforms.outlineWidthMultiplyTexture.value}set outlineWidthMultiplyTexture(t){this.uniforms.outlineWidthMultiplyTexture.value=t}get outlineWidthFactor(){return this.uniforms.outlineWidthFactor.value}set outlineWidthFactor(t){this.uniforms.outlineWidthFactor.value=t}get outlineColorFactor(){return this.uniforms.outlineColorFactor.value}set outlineColorFactor(t){this.uniforms.outlineColorFactor.value=t}get outlineLightingMixFactor(){return this.uniforms.outlineLightingMixFactor.value}set outlineLightingMixFactor(t){this.uniforms.outlineLightingMixFactor.value=t}get uvAnimationMaskTexture(){return this.uniforms.uvAnimationMaskTexture.value}set uvAnimationMaskTexture(t){this.uniforms.uvAnimationMaskTexture.value=t}get uvAnimationScrollXOffset(){return this.uniforms.uvAnimationScrollXOffset.value}set uvAnimationScrollXOffset(t){this.uniforms.uvAnimationScrollXOffset.value=t}get uvAnimationScrollYOffset(){return this.uniforms.uvAnimationScrollYOffset.value}set uvAnimationScrollYOffset(t){this.uniforms.uvAnimationScrollYOffset.value=t}get uvAnimationRotationPhase(){return this.uniforms.uvAnimationRotationPhase.value}set uvAnimationRotationPhase(t){this.uniforms.uvAnimationRotationPhase.value=t}get ignoreVertexColor(){return this._ignoreVertexColor}set ignoreVertexColor(t){this._ignoreVertexColor=t,this.needsUpdate=!0}get v0CompatShade(){return this._v0CompatShade}set v0CompatShade(t){this._v0CompatShade=t,this.needsUpdate=!0}get debugMode(){return this._debugMode}set debugMode(t){this._debugMode=t,this.needsUpdate=!0}get outlineWidthMode(){return this._outlineWidthMode}set outlineWidthMode(t){this._outlineWidthMode=t,this.needsUpdate=!0}get isOutline(){return this._isOutline}set isOutline(t){this._isOutline=t,this.needsUpdate=!0}get isMToonMaterial(){return!0}update(t){this._uploadUniformsWorkaround(),this._updateUVAnimation(t)}copy(t){return super.copy(t),this.map=t.map,this.normalMap=t.normalMap,this.emissiveMap=t.emissiveMap,this.shadeMultiplyTexture=t.shadeMultiplyTexture,this.shadingShiftTexture=t.shadingShiftTexture,this.matcapTexture=t.matcapTexture,this.rimMultiplyTexture=t.rimMultiplyTexture,this.outlineWidthMultiplyTexture=t.outlineWidthMultiplyTexture,this.uvAnimationMaskTexture=t.uvAnimationMaskTexture,this.normalMapType=t.normalMapType,this.uvAnimationScrollXSpeedFactor=t.uvAnimationScrollXSpeedFactor,this.uvAnimationScrollYSpeedFactor=t.uvAnimationScrollYSpeedFactor,this.uvAnimationRotationSpeedFactor=t.uvAnimationRotationSpeedFactor,this.ignoreVertexColor=t.ignoreVertexColor,this.v0CompatShade=t.v0CompatShade,this.debugMode=t.debugMode,this.outlineWidthMode=t.outlineWidthMode,this.isOutline=t.isOutline,this.needsUpdate=!0,this}_updateUVAnimation(t){this.uniforms.uvAnimationScrollXOffset.value+=t*this.uvAnimationScrollXSpeedFactor,this.uniforms.uvAnimationScrollYOffset.value+=t*this.uvAnimationScrollYSpeedFactor,this.uniforms.uvAnimationRotationPhase.value+=t*this.uvAnimationRotationSpeedFactor,this.uniforms.alphaTest.value=this.alphaTest,this.uniformsNeedUpdate=!0}_uploadUniformsWorkaround(){this.uniforms.opacity.value=this.opacity,this._updateTextureMatrix(this.uniforms.map,this.uniforms.mapUvTransform),this._updateTextureMatrix(this.uniforms.normalMap,this.uniforms.normalMapUvTransform),this._updateTextureMatrix(this.uniforms.emissiveMap,this.uniforms.emissiveMapUvTransform),this._updateTextureMatrix(this.uniforms.shadeMultiplyTexture,this.uniforms.shadeMultiplyTextureUvTransform),this._updateTextureMatrix(this.uniforms.shadingShiftTexture,this.uniforms.shadingShiftTextureUvTransform),this._updateTextureMatrix(this.uniforms.matcapTexture,this.uniforms.matcapTextureUvTransform),this._updateTextureMatrix(this.uniforms.rimMultiplyTexture,this.uniforms.rimMultiplyTextureUvTransform),this._updateTextureMatrix(this.uniforms.outlineWidthMultiplyTexture,this.uniforms.outlineWidthMultiplyTextureUvTransform),this._updateTextureMatrix(this.uniforms.uvAnimationMaskTexture,this.uniforms.uvAnimationMaskTextureUvTransform),this.uniformsNeedUpdate=!0}_generateDefines(){let t=parseInt(P.REVISION,10),e=this.outlineWidthMultiplyTexture!==null,n=this.map!==null||this.normalMap!==null||this.emissiveMap!==null||this.shadeMultiplyTexture!==null||this.shadingShiftTexture!==null||this.rimMultiplyTexture!==null||this.uvAnimationMaskTexture!==null;return{THREE_VRM_THREE_REVISION:t,OUTLINE:this._isOutline,MTOON_USE_UV:e||n,MTOON_UVS_VERTEX_ONLY:e&&!n,V0_COMPAT_SHADE:this._v0CompatShade,USE_SHADEMULTIPLYTEXTURE:this.shadeMultiplyTexture!==null,USE_SHADINGSHIFTTEXTURE:this.shadingShiftTexture!==null,USE_MATCAPTEXTURE:this.matcapTexture!==null,USE_RIMMULTIPLYTEXTURE:this.rimMultiplyTexture!==null,USE_OUTLINEWIDTHMULTIPLYTEXTURE:this._isOutline&&this.outlineWidthMultiplyTexture!==null,USE_UVANIMATIONMASKTEXTURE:this.uvAnimationMaskTexture!==null,IGNORE_VERTEX_COLOR:this._ignoreVertexColor===!0,DEBUG_NORMAL:this._debugMode==="normal",DEBUG_LITSHADERATE:this._debugMode==="litShadeRate",DEBUG_UV:this._debugMode==="uv",OUTLINE_WIDTH_SCREEN:this._isOutline&&this._outlineWidthMode===Rr.ScreenCoordinates}}_updateTextureMatrix(t,e){t.value&&(t.value.matrixAutoUpdate&&t.value.updateMatrix(),e.value.copy(t.value.matrix))}},Xs=new Set(["1.0","1.0-beta"]),$r=class tt{get name(){return tt.EXTENSION_NAME}constructor(e,n={}){var r,i,s,o;this.parser=e,this.materialType=(r=n.materialType)!=null?r:Vt,this.renderOrderOffset=(i=n.renderOrderOffset)!=null?i:0,this.v0CompatShade=(s=n.v0CompatShade)!=null?s:!1,this.debugMode=(o=n.debugMode)!=null?o:"none",this._mToonMaterialSet=new Set}beforeRoot(){return ve(this,null,function*(){this._removeUnlitExtensionIfMToonExists()})}afterRoot(e){return ve(this,null,function*(){e.userData.vrmMToonMaterials=Array.from(this._mToonMaterialSet)})}getMaterialType(e){return this._getMToonExtension(e)?this.materialType:null}extendMaterialParams(e,n){let r=this._getMToonExtension(e);return r?this._extendMaterialParams(r,n):null}loadMesh(e){return ve(this,null,function*(){var n;let r=this.parser,s=(n=r.json.meshes)==null?void 0:n[e];if(s==null)throw new Error(`MToonMaterialLoaderPlugin: Attempt to use meshes[${e}] of glTF but the mesh doesn't exist`);let o=s.primitives,l=yield r.loadMesh(e);if(o.length===1){let a=l,u=o[0].material;u!=null&&this._setupPrimitive(a,u)}else{let a=l;for(let u=0;u<o.length;u++){let d=a.children[u],c=o[u].material;c!=null&&this._setupPrimitive(d,c)}}return l})}_removeUnlitExtensionIfMToonExists(){let r=this.parser.json.materials;r?.map((i,s)=>{var o;this._getMToonExtension(s)&&((o=i.extensions)!=null&&o.KHR_materials_unlit)&&delete i.extensions.KHR_materials_unlit})}_getMToonExtension(e){var n,r;let o=(n=this.parser.json.materials)==null?void 0:n[e];if(o==null){console.warn(`MToonMaterialLoaderPlugin: Attempt to use materials[${e}] of glTF but the material doesn't exist`);return}let l=(r=o.extensions)==null?void 0:r[tt.EXTENSION_NAME];if(l==null)return;let a=l.specVersion;if(!Xs.has(a)){console.warn(`MToonMaterialLoaderPlugin: Unknown ${tt.EXTENSION_NAME} specVersion "${a}"`);return}return l}_extendMaterialParams(e,n){return ve(this,null,function*(){var r;delete n.metalness,delete n.roughness;let i=new ks(this.parser,n);i.assignPrimitive("transparentWithZWrite",e.transparentWithZWrite),i.assignColor("shadeColorFactor",e.shadeColorFactor),i.assignTexture("shadeMultiplyTexture",e.shadeMultiplyTexture,!0),i.assignPrimitive("shadingShiftFactor",e.shadingShiftFactor),i.assignTexture("shadingShiftTexture",e.shadingShiftTexture,!0),i.assignPrimitive("shadingShiftTextureScale",(r=e.shadingShiftTexture)==null?void 0:r.scale),i.assignPrimitive("shadingToonyFactor",e.shadingToonyFactor),i.assignPrimitive("giEqualizationFactor",e.giEqualizationFactor),i.assignColor("matcapFactor",e.matcapFactor),i.assignTexture("matcapTexture",e.matcapTexture,!0),i.assignColor("parametricRimColorFactor",e.parametricRimColorFactor),i.assignTexture("rimMultiplyTexture",e.rimMultiplyTexture,!0),i.assignPrimitive("rimLightingMixFactor",e.rimLightingMixFactor),i.assignPrimitive("parametricRimFresnelPowerFactor",e.parametricRimFresnelPowerFactor),i.assignPrimitive("parametricRimLiftFactor",e.parametricRimLiftFactor),i.assignPrimitive("outlineWidthMode",e.outlineWidthMode),i.assignPrimitive("outlineWidthFactor",e.outlineWidthFactor),i.assignTexture("outlineWidthMultiplyTexture",e.outlineWidthMultiplyTexture,!1),i.assignColor("outlineColorFactor",e.outlineColorFactor),i.assignPrimitive("outlineLightingMixFactor",e.outlineLightingMixFactor),i.assignTexture("uvAnimationMaskTexture",e.uvAnimationMaskTexture,!1),i.assignPrimitive("uvAnimationScrollXSpeedFactor",e.uvAnimationScrollXSpeedFactor),i.assignPrimitive("uvAnimationScrollYSpeedFactor",e.uvAnimationScrollYSpeedFactor),i.assignPrimitive("uvAnimationRotationSpeedFactor",e.uvAnimationRotationSpeedFactor),i.assignPrimitive("v0CompatShade",this.v0CompatShade),i.assignPrimitive("debugMode",this.debugMode),yield i.pending})}_setupPrimitive(e,n){let r=this._getMToonExtension(n);if(r){let i=this._parseRenderOrder(r);e.renderOrder=i+this.renderOrderOffset,this._generateOutline(e),this._addToMaterialSet(e);return}}_shouldGenerateOutline(e){return typeof e.outlineWidthMode=="string"&&e.outlineWidthMode!=="none"&&typeof e.outlineWidthFactor=="number"&&e.outlineWidthFactor>0}_generateOutline(e){let n=e.material;if(!(n instanceof lt.Material)||!this._shouldGenerateOutline(n))return;e.material=[n];let r=n.clone();r.name+=" (Outline)",r.isOutline=!0,r.side=lt.BackSide,e.material.push(r);let i=e.geometry,s=i.index?i.index.count:i.attributes.position.count/3;i.addGroup(0,s,0),i.addGroup(0,s,1)}_addToMaterialSet(e){let n=e.material,r=new Set;Array.isArray(n)?n.forEach(i=>r.add(i)):r.add(n);for(let i of r)this._mToonMaterialSet.add(i)}_parseRenderOrder(e){var n;return(e.transparentWithZWrite?0:19)+((n=e.renderQueueOffsetNumber)!=null?n:0)}};$r.EXTENSION_NAME="VRMC_materials_mtoon";var qs=$r,Ys=(t,e,n)=>new Promise((r,i)=>{var s=a=>{try{l(n.next(a))}catch(u){i(u)}},o=a=>{try{l(n.throw(a))}catch(u){i(u)}},l=a=>a.done?r(a.value):Promise.resolve(a.value).then(s,o);l((n=n.apply(t,e)).next())}),Jr=class Ht{get name(){return Ht.EXTENSION_NAME}constructor(e){this.parser=e}extendMaterialParams(e,n){return Ys(this,null,function*(){let r=this._getHDREmissiveMultiplierExtension(e);if(r==null)return;console.warn("VRMMaterialsHDREmissiveMultiplierLoaderPlugin: `VRMC_materials_hdr_emissiveMultiplier` is archived. Use `KHR_materials_emissive_strength` instead.");let i=r.emissiveMultiplier;n.emissiveIntensity=i})}_getHDREmissiveMultiplierExtension(e){var n,r;let o=(n=this.parser.json.materials)==null?void 0:n[e];if(o==null){console.warn(`VRMMaterialsHDREmissiveMultiplierLoaderPlugin: Attempt to use materials[${e}] of glTF but the material doesn't exist`);return}let l=(r=o.extensions)==null?void 0:r[Ht.EXTENSION_NAME];if(l!=null)return l}};Jr.EXTENSION_NAME="VRMC_materials_hdr_emissiveMultiplier";var Qs=Jr,Ks=Object.defineProperty,Zs=Object.defineProperties,$s=Object.getOwnPropertyDescriptors,xr=Object.getOwnPropertySymbols,Js=Object.prototype.hasOwnProperty,eo=Object.prototype.propertyIsEnumerable,Ar=(t,e,n)=>e in t?Ks(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n,Q=(t,e)=>{for(var n in e||(e={}))Js.call(e,n)&&Ar(t,n,e[n]);if(xr)for(var n of xr(e))eo.call(e,n)&&Ar(t,n,e[n]);return t},yr=(t,e)=>Zs(t,$s(e)),to=(t,e,n)=>new Promise((r,i)=>{var s=a=>{try{l(n.next(a))}catch(u){i(u)}},o=a=>{try{l(n.throw(a))}catch(u){i(u)}},l=a=>a.done?r(a.value):Promise.resolve(a.value).then(s,o);l((n=n.apply(t,e)).next())});function Ae(t){return Math.pow(t,2.2)}var no=class{get name(){return"VRMMaterialsV0CompatPlugin"}constructor(t){var e;this.parser=t,this._renderQueueMapTransparent=new Map,this._renderQueueMapTransparentZWrite=new Map;let n=this.parser.json;n.extensionsUsed=(e=n.extensionsUsed)!=null?e:[],n.extensionsUsed.indexOf("KHR_texture_transform")===-1&&n.extensionsUsed.push("KHR_texture_transform")}beforeRoot(){return to(this,null,function*(){var t;let e=this.parser.json,n=(t=e.extensions)==null?void 0:t.VRM,r=n?.materialProperties;r&&(this._populateRenderQueueMap(r),r.forEach((i,s)=>{var o,l;let a=(o=e.materials)==null?void 0:o[s];if(a==null){console.warn(`VRMMaterialsV0CompatPlugin: Attempt to use materials[${s}] of glTF but the material doesn't exist`);return}if(i.shader==="VRM/MToon"){let u=this._parseV0MToonProperties(i,a);e.materials[s]=u}else if((l=i.shader)!=null&&l.startsWith("VRM/Unlit")){let u=this._parseV0UnlitProperties(i,a);e.materials[s]=u}else i.shader==="VRM_USE_GLTFSHADER"||console.warn(`VRMMaterialsV0CompatPlugin: Unknown shader: ${i.shader}`)}))})}_parseV0MToonProperties(t,e){var n,r,i,s,o,l,a,u,d,c,h,p,m,g,_,v,T,x,E,M,y,w,b,H,I,O,V,ne,He,Ne,$,q,Re,Oe,D,En,Tn,Mn,Rn,xn,An,yn,wn,Sn,bn,Ln,Pn,In,Hn,Nn,On,Cn,Un,Vn,Bn;let Dn=(r=(n=t.keywordMap)==null?void 0:n._ALPHABLEND_ON)!=null?r:!1,Ti=((i=t.floatProperties)==null?void 0:i._ZWrite)===1&&Dn,Mi=this._v0ParseRenderQueue(t),Fn=(o=(s=t.keywordMap)==null?void 0:s._ALPHATEST_ON)!=null?o:!1,Ri=Dn?"BLEND":Fn?"MASK":"OPAQUE",xi=Fn?(a=(l=t.floatProperties)==null?void 0:l._Cutoff)!=null?a:.5:void 0,Ai=((d=(u=t.floatProperties)==null?void 0:u._CullMode)!=null?d:2)===0,pe=this._portTextureTransform(t),yi=((h=(c=t.vectorProperties)==null?void 0:c._Color)!=null?h:[1,1,1,1]).map((Qn,Qi)=>Qi===3?Qn:Ae(Qn)),kn=(p=t.textureProperties)==null?void 0:p._MainTex,wi=kn!=null?{index:kn,extensions:Q({},pe)}:void 0,Si=(g=(m=t.floatProperties)==null?void 0:m._BumpScale)!=null?g:1,Wn=(_=t.textureProperties)==null?void 0:_._BumpMap,bi=Wn!=null?{index:Wn,scale:Si,extensions:Q({},pe)}:void 0,Li=((T=(v=t.vectorProperties)==null?void 0:v._EmissionColor)!=null?T:[0,0,0,1]).map(Ae),Gn=(x=t.textureProperties)==null?void 0:x._EmissionMap,Pi=Gn!=null?{index:Gn,extensions:Q({},pe)}:void 0,Ii=((M=(E=t.vectorProperties)==null?void 0:E._ShadeColor)!=null?M:[.97,.81,.86,1]).map(Ae),zn=(y=t.textureProperties)==null?void 0:y._ShadeTexture,Hi=zn!=null?{index:zn,extensions:Q({},pe)}:void 0,Xe=(b=(w=t.floatProperties)==null?void 0:w._ShadeShift)!=null?b:0,qe=(I=(H=t.floatProperties)==null?void 0:H._ShadeToony)!=null?I:.9;qe=ei.MathUtils.lerp(qe,1,.5+.5*Xe),Xe=-Xe-(1-qe);let jn=(V=(O=t.floatProperties)==null?void 0:O._IndirectLightIntensity)!=null?V:.1,Ni=jn?1-jn:void 0,pt=(ne=t.textureProperties)==null?void 0:ne._SphereAdd,Oi=pt!=null?[1,1,1]:void 0,Ci=pt!=null?{index:pt}:void 0,Ui=(Ne=(He=t.floatProperties)==null?void 0:He._RimLightingMix)!=null?Ne:0,Xn=($=t.textureProperties)==null?void 0:$._RimTexture,Vi=Xn!=null?{index:Xn,extensions:Q({},pe)}:void 0,Bi=((Re=(q=t.vectorProperties)==null?void 0:q._RimColor)!=null?Re:[0,0,0,1]).map(Ae),Di=(D=(Oe=t.floatProperties)==null?void 0:Oe._RimFresnelPower)!=null?D:1,Fi=(Tn=(En=t.floatProperties)==null?void 0:En._RimLift)!=null?Tn:0,ki=["none","worldCoordinates","screenCoordinates"][(Rn=(Mn=t.floatProperties)==null?void 0:Mn._OutlineWidthMode)!=null?Rn:0],mt=(An=(xn=t.floatProperties)==null?void 0:xn._OutlineWidth)!=null?An:0;mt=.01*mt;let qn=(yn=t.textureProperties)==null?void 0:yn._OutlineWidthTexture,Wi=qn!=null?{index:qn,extensions:Q({},pe)}:void 0,Gi=((Sn=(wn=t.vectorProperties)==null?void 0:wn._OutlineColor)!=null?Sn:[0,0,0]).map(Ae),zi=((Ln=(bn=t.floatProperties)==null?void 0:bn._OutlineColorMode)!=null?Ln:0)===1?(In=(Pn=t.floatProperties)==null?void 0:Pn._OutlineLightingMix)!=null?In:1:0,Yn=(Hn=t.textureProperties)==null?void 0:Hn._UvAnimMaskTexture,ji=Yn!=null?{index:Yn,extensions:Q({},pe)}:void 0,Xi=(On=(Nn=t.floatProperties)==null?void 0:Nn._UvAnimScrollX)!=null?On:0,Ye=(Un=(Cn=t.floatProperties)==null?void 0:Cn._UvAnimScrollY)!=null?Un:0;Ye!=null&&(Ye=-Ye);let qi=(Bn=(Vn=t.floatProperties)==null?void 0:Vn._UvAnimRotation)!=null?Bn:0,Yi={specVersion:"1.0",transparentWithZWrite:Ti,renderQueueOffsetNumber:Mi,shadeColorFactor:Ii,shadeMultiplyTexture:Hi,shadingShiftFactor:Xe,shadingToonyFactor:qe,giEqualizationFactor:Ni,matcapFactor:Oi,matcapTexture:Ci,rimLightingMixFactor:Ui,rimMultiplyTexture:Vi,parametricRimColorFactor:Bi,parametricRimFresnelPowerFactor:Di,parametricRimLiftFactor:Fi,outlineWidthMode:ki,outlineWidthFactor:mt,outlineWidthMultiplyTexture:Wi,outlineColorFactor:Gi,outlineLightingMixFactor:zi,uvAnimationMaskTexture:ji,uvAnimationScrollXSpeedFactor:Xi,uvAnimationScrollYSpeedFactor:Ye,uvAnimationRotationSpeedFactor:qi};return yr(Q({},e),{pbrMetallicRoughness:{baseColorFactor:yi,baseColorTexture:wi},normalTexture:bi,emissiveTexture:Pi,emissiveFactor:Li,alphaMode:Ri,alphaCutoff:xi,doubleSided:Ai,extensions:{VRMC_materials_mtoon:Yi}})}_parseV0UnlitProperties(t,e){var n,r,i,s,o;let l=t.shader==="VRM/UnlitTransparentZWrite",a=t.shader==="VRM/UnlitTransparent"||l,u=this._v0ParseRenderQueue(t),d=t.shader==="VRM/UnlitCutout",c=a?"BLEND":d?"MASK":"OPAQUE",h=d?(r=(n=t.floatProperties)==null?void 0:n._Cutoff)!=null?r:.5:void 0,p=this._portTextureTransform(t),m=((s=(i=t.vectorProperties)==null?void 0:i._Color)!=null?s:[1,1,1,1]).map(Ae),g=(o=t.textureProperties)==null?void 0:o._MainTex,_=g!=null?{index:g,extensions:Q({},p)}:void 0,v={specVersion:"1.0",transparentWithZWrite:l,renderQueueOffsetNumber:u,shadeColorFactor:m,shadeMultiplyTexture:_};return yr(Q({},e),{pbrMetallicRoughness:{baseColorFactor:m,baseColorTexture:_},alphaMode:c,alphaCutoff:h,extensions:{VRMC_materials_mtoon:v}})}_portTextureTransform(t){var e,n,r,i,s;let o=(e=t.vectorProperties)==null?void 0:e._MainTex;if(o==null)return{};let l=[(n=o?.[0])!=null?n:0,(r=o?.[1])!=null?r:0],a=[(i=o?.[2])!=null?i:1,(s=o?.[3])!=null?s:1];return l[1]=1-a[1]-l[1],{KHR_texture_transform:{offset:l,scale:a}}}_v0ParseRenderQueue(t){var e,n;let r=t.shader==="VRM/UnlitTransparentZWrite",i=((e=t.keywordMap)==null?void 0:e._ALPHABLEND_ON)!=null||t.shader==="VRM/UnlitTransparent"||r,s=((n=t.floatProperties)==null?void 0:n._ZWrite)===1||r,o=0;if(i){let l=t.renderQueue;l!=null&&(s?o=this._renderQueueMapTransparentZWrite.get(l):o=this._renderQueueMapTransparent.get(l))}return o}_populateRenderQueueMap(t){let e=new Set,n=new Set;t.forEach(r=>{var i,s;let o=r.shader==="VRM/UnlitTransparentZWrite",l=((i=r.keywordMap)==null?void 0:i._ALPHABLEND_ON)!=null||r.shader==="VRM/UnlitTransparent"||o,a=((s=r.floatProperties)==null?void 0:s._ZWrite)===1||o;if(l){let u=r.renderQueue;u!=null&&(a?n.add(u):e.add(u))}}),e.size>10&&console.warn(`VRMMaterialsV0CompatPlugin: This VRM uses ${e.size} render queues for Transparent materials while VRM 1.0 only supports up to 10 render queues. The model might not be rendered correctly.`),n.size>10&&console.warn(`VRMMaterialsV0CompatPlugin: This VRM uses ${n.size} render queues for TransparentZWrite materials while VRM 1.0 only supports up to 10 render queues. The model might not be rendered correctly.`),Array.from(e).sort().forEach((r,i)=>{let s=Math.min(Math.max(i-e.size+1,-9),0);this._renderQueueMapTransparent.set(r,s)}),Array.from(n).sort().forEach((r,i)=>{let s=Math.min(Math.max(i,0),9);this._renderQueueMapTransparentZWrite.set(r,s)})}},wr=(t,e,n)=>new Promise((r,i)=>{var s=a=>{try{l(n.next(a))}catch(u){i(u)}},o=a=>{try{l(n.throw(a))}catch(u){i(u)}},l=a=>a.done?r(a.value):Promise.resolve(a.value).then(s,o);l((n=n.apply(t,e)).next())}),re=new F.Vector3,Mt=class extends F.Group{constructor(t){super(),this._attrPosition=new F.BufferAttribute(new Float32Array([0,0,0,0,0,0]),3),this._attrPosition.setUsage(F.DynamicDrawUsage);let e=new F.BufferGeometry;e.setAttribute("position",this._attrPosition);let n=new F.LineBasicMaterial({color:16711935,depthTest:!1,depthWrite:!1});this._line=new F.Line(e,n),this.add(this._line),this.constraint=t}updateMatrixWorld(t){re.setFromMatrixPosition(this.constraint.destination.matrixWorld),this._attrPosition.setXYZ(0,re.x,re.y,re.z),this.constraint.source&&re.setFromMatrixPosition(this.constraint.source.matrixWorld),this._attrPosition.setXYZ(1,re.x,re.y,re.z),this._attrPosition.needsUpdate=!0,super.updateMatrixWorld(t)}};function Sr(t,e){return e.set(t.elements[12],t.elements[13],t.elements[14])}var ro=new Bt.Vector3,io=new Bt.Vector3;function so(t,e){return t.decompose(ro,e,io),e}function rt(t){return t.invert?t.invert():t.inverse(),t}var Dt=class{constructor(t,e){this.destination=t,this.source=e,this.weight=1}},oo=new Z.Vector3,ao=new Z.Vector3,lo=new Z.Vector3,uo=new Z.Quaternion,co=new Z.Quaternion,ho=new Z.Quaternion,fo=class extends Dt{get aimAxis(){return this._aimAxis}set aimAxis(t){this._aimAxis=t,this._v3AimAxis.set(t==="PositiveX"?1:t==="NegativeX"?-1:0,t==="PositiveY"?1:t==="NegativeY"?-1:0,t==="PositiveZ"?1:t==="NegativeZ"?-1:0)}get dependencies(){let t=new Set([this.source]);return this.destination.parent&&t.add(this.destination.parent),t}constructor(t,e){super(t,e),this._aimAxis="PositiveX",this._v3AimAxis=new Z.Vector3(1,0,0),this._dstRestQuat=new Z.Quaternion}setInitState(){this._dstRestQuat.copy(this.destination.quaternion)}update(){this.destination.updateWorldMatrix(!0,!1),this.source.updateWorldMatrix(!0,!1);let t=uo.identity(),e=co.identity();this.destination.parent&&(so(this.destination.parent.matrixWorld,t),rt(e.copy(t)));let n=oo.copy(this._v3AimAxis).applyQuaternion(this._dstRestQuat).applyQuaternion(t),r=Sr(this.source.matrixWorld,ao).sub(Sr(this.destination.matrixWorld,lo)).normalize(),i=ho.setFromUnitVectors(n,r).premultiply(e).multiply(t).multiply(this._dstRestQuat);this.destination.quaternion.copy(this._dstRestQuat).slerp(i,this.weight)}};function po(t,e){let n=[t],r=t.parent;for(;r!==null;)n.unshift(r),r=r.parent;n.forEach(i=>{e(i)})}var mo=class{constructor(){this._constraints=new Set,this._objectConstraintsMap=new Map}get constraints(){return this._constraints}addConstraint(t){this._constraints.add(t);let e=this._objectConstraintsMap.get(t.destination);e==null&&(e=new Set,this._objectConstraintsMap.set(t.destination,e)),e.add(t)}deleteConstraint(t){this._constraints.delete(t),this._objectConstraintsMap.get(t.destination).delete(t)}setInitState(){let t=new Set,e=new Set;for(let n of this._constraints)this._processConstraint(n,t,e,r=>r.setInitState())}update(){let t=new Set,e=new Set;for(let n of this._constraints)this._processConstraint(n,t,e,r=>r.update())}_processConstraint(t,e,n,r){if(n.has(t))return;if(e.has(t))throw new Error("VRMNodeConstraintManager: Circular dependency detected while updating constraints");e.add(t);let i=t.dependencies;for(let s of i)po(s,o=>{let l=this._objectConstraintsMap.get(o);if(l)for(let a of l)this._processConstraint(a,e,n,r)});r(t),n.add(t)}},go=new Ge.Quaternion,_o=new Ge.Quaternion,vo=class extends Dt{get dependencies(){return new Set([this.source])}constructor(t,e){super(t,e),this._dstRestQuat=new Ge.Quaternion,this._invSrcRestQuat=new Ge.Quaternion}setInitState(){this._dstRestQuat.copy(this.destination.quaternion),rt(this._invSrcRestQuat.copy(this.source.quaternion))}update(){let t=go.copy(this._invSrcRestQuat).multiply(this.source.quaternion),e=_o.copy(this._dstRestQuat).multiply(t);this.destination.quaternion.copy(this._dstRestQuat).slerp(e,this.weight)}},Eo=new J.Vector3,To=new J.Quaternion,Mo=new J.Quaternion,Ro=class extends Dt{get rollAxis(){return this._rollAxis}set rollAxis(t){this._rollAxis=t,this._v3RollAxis.set(t==="X"?1:0,t==="Y"?1:0,t==="Z"?1:0)}get dependencies(){return new Set([this.source])}constructor(t,e){super(t,e),this._rollAxis="X",this._v3RollAxis=new J.Vector3(1,0,0),this._dstRestQuat=new J.Quaternion,this._invDstRestQuat=new J.Quaternion,this._invSrcRestQuatMulDstRestQuat=new J.Quaternion}setInitState(){this._dstRestQuat.copy(this.destination.quaternion),rt(this._invDstRestQuat.copy(this._dstRestQuat)),rt(this._invSrcRestQuatMulDstRestQuat.copy(this.source.quaternion)).multiply(this._dstRestQuat)}update(){let t=To.copy(this._invDstRestQuat).multiply(this.source.quaternion).multiply(this._invSrcRestQuatMulDstRestQuat),e=Eo.copy(this._v3RollAxis).applyQuaternion(t),r=Mo.setFromUnitVectors(e,this._v3RollAxis).premultiply(this._dstRestQuat).multiply(t);this.destination.quaternion.copy(this._dstRestQuat).slerp(r,this.weight)}},xo=new Set(["1.0","1.0-beta"]),ti=class Fe{get name(){return Fe.EXTENSION_NAME}constructor(e,n){this.parser=e,this.helperRoot=n?.helperRoot}afterRoot(e){return wr(this,null,function*(){e.userData.vrmNodeConstraintManager=yield this._import(e)})}_import(e){return wr(this,null,function*(){var n;let r=this.parser.json;if(!(((n=r.extensionsUsed)==null?void 0:n.indexOf(Fe.EXTENSION_NAME))!==-1))return null;let s=new mo,o=yield this.parser.getDependencies("node");return o.forEach((l,a)=>{var u;let d=r.nodes[a],c=(u=d?.extensions)==null?void 0:u[Fe.EXTENSION_NAME];if(c==null)return;let h=c.specVersion;if(!xo.has(h)){console.warn(`VRMNodeConstraintLoaderPlugin: Unknown ${Fe.EXTENSION_NAME} specVersion "${h}"`);return}let p=c.constraint;if(p.roll!=null){let m=this._importRollConstraint(l,o,p.roll);s.addConstraint(m)}else if(p.aim!=null){let m=this._importAimConstraint(l,o,p.aim);s.addConstraint(m)}else if(p.rotation!=null){let m=this._importRotationConstraint(l,o,p.rotation);s.addConstraint(m)}}),e.scene.updateMatrixWorld(),s.setInitState(),s})}_importRollConstraint(e,n,r){let{source:i,rollAxis:s,weight:o}=r,l=n[i],a=new Ro(e,l);if(s!=null&&(a.rollAxis=s),o!=null&&(a.weight=o),this.helperRoot){let u=new Mt(a);this.helperRoot.add(u)}return a}_importAimConstraint(e,n,r){let{source:i,aimAxis:s,weight:o}=r,l=n[i],a=new fo(e,l);if(s!=null&&(a.aimAxis=s),o!=null&&(a.weight=o),this.helperRoot){let u=new Mt(a);this.helperRoot.add(u)}return a}_importRotationConstraint(e,n,r){let{source:i,weight:s}=r,o=n[i],l=new vo(e,o);if(s!=null&&(l.weight=s),this.helperRoot){let a=new Mt(l);this.helperRoot.add(a)}return l}};ti.EXTENSION_NAME="VRMC_node_constraint";var Ao=ti,$e=(t,e,n)=>new Promise((r,i)=>{var s=a=>{try{l(n.next(a))}catch(u){i(u)}},o=a=>{try{l(n.throw(a))}catch(u){i(u)}},l=a=>a.done?r(a.value):Promise.resolve(a.value).then(s,o);l((n=n.apply(t,e)).next())}),kt=class{},Rt=new ze.Vector3,_e=new ze.Vector3,ii=class extends kt{get type(){return"capsule"}constructor(t){var e,n,r,i;super(),this.offset=(e=t?.offset)!=null?e:new ze.Vector3(0,0,0),this.tail=(n=t?.tail)!=null?n:new ze.Vector3(0,0,0),this.radius=(r=t?.radius)!=null?r:0,this.inside=(i=t?.inside)!=null?i:!1}calculateCollision(t,e,n,r){Rt.setFromMatrixPosition(t),_e.subVectors(this.tail,this.offset).applyMatrix4(t),_e.sub(Rt);let i=_e.lengthSq();r.copy(e).sub(Rt);let s=_e.dot(r);s<=0||(i<=s||_e.multiplyScalar(s/i),r.sub(_e));let o=r.length(),l=this.inside?this.radius-n-o:o-n-this.radius;return l<0&&(r.multiplyScalar(1/o),this.inside&&r.negate()),l}},xt=new Le.Vector3,br=new Le.Matrix3,si=class extends kt{get type(){return"plane"}constructor(t){var e,n;super(),this.offset=(e=t?.offset)!=null?e:new Le.Vector3(0,0,0),this.normal=(n=t?.normal)!=null?n:new Le.Vector3(0,0,1)}calculateCollision(t,e,n,r){r.setFromMatrixPosition(t),r.negate().add(e),br.getNormalMatrix(t),xt.copy(this.normal).applyNormalMatrix(br).normalize();let i=r.dot(xt)-n;return r.copy(xt),i}},yo=new Ft.Vector3,oi=class extends kt{get type(){return"sphere"}constructor(t){var e,n,r;super(),this.offset=(e=t?.offset)!=null?e:new Ft.Vector3(0,0,0),this.radius=(n=t?.radius)!=null?n:0,this.inside=(r=t?.inside)!=null?r:!1}calculateCollision(t,e,n,r){r.subVectors(e,yo.setFromMatrixPosition(t));let i=r.length(),s=this.inside?this.radius-n-i:i-n-this.radius;return s<0&&(r.multiplyScalar(1/i),this.inside&&r.negate()),s}},K=new ee.Vector3,wo=class extends ee.BufferGeometry{constructor(t){super(),this.worldScale=1,this._currentRadius=0,this._currentOffset=new ee.Vector3,this._currentTail=new ee.Vector3,this._shape=t,this._attrPos=new ee.BufferAttribute(new Float32Array(396),3),this.setAttribute("position",this._attrPos),this._attrIndex=new ee.BufferAttribute(new Uint16Array(264),1),this.setIndex(this._attrIndex),this._buildIndex(),this.update()}update(){let t=!1,e=this._shape.radius/this.worldScale;this._currentRadius!==e&&(this._currentRadius=e,t=!0),this._currentOffset.equals(this._shape.offset)||(this._currentOffset.copy(this._shape.offset),t=!0);let n=K.copy(this._shape.tail).divideScalar(this.worldScale);this._currentTail.distanceToSquared(n)>1e-10&&(this._currentTail.copy(n),t=!0),t&&this._buildPosition()}_buildPosition(){K.copy(this._currentTail).sub(this._currentOffset);let t=K.length()/this._currentRadius;for(let r=0;r<=16;r++){let i=r/16*Math.PI;this._attrPos.setXYZ(r,-Math.sin(i),-Math.cos(i),0),this._attrPos.setXYZ(17+r,t+Math.sin(i),Math.cos(i),0),this._attrPos.setXYZ(34+r,-Math.sin(i),0,-Math.cos(i)),this._attrPos.setXYZ(51+r,t+Math.sin(i),0,Math.cos(i))}for(let r=0;r<32;r++){let i=r/16*Math.PI;this._attrPos.setXYZ(68+r,0,Math.sin(i),Math.cos(i)),this._attrPos.setXYZ(100+r,t,Math.sin(i),Math.cos(i))}let e=Math.atan2(K.y,Math.sqrt(K.x*K.x+K.z*K.z)),n=-Math.atan2(K.z,K.x);this.rotateZ(e),this.rotateY(n),this.scale(this._currentRadius,this._currentRadius,this._currentRadius),this.translate(this._currentOffset.x,this._currentOffset.y,this._currentOffset.z),this._attrPos.needsUpdate=!0}_buildIndex(){for(let t=0;t<34;t++){let e=(t+1)%34;this._attrIndex.setXY(t*2,t,e),this._attrIndex.setXY(68+t*2,34+t,34+e)}for(let t=0;t<32;t++){let e=(t+1)%32;this._attrIndex.setXY(136+t*2,68+t,68+e),this._attrIndex.setXY(200+t*2,100+t,100+e)}this._attrIndex.needsUpdate=!0}},So=class extends oe.BufferGeometry{constructor(t){super(),this.worldScale=1,this._currentOffset=new oe.Vector3,this._currentNormal=new oe.Vector3,this._shape=t,this._attrPos=new oe.BufferAttribute(new Float32Array(18),3),this.setAttribute("position",this._attrPos),this._attrIndex=new oe.BufferAttribute(new Uint16Array(10),1),this.setIndex(this._attrIndex),this._buildIndex(),this.update()}update(){let t=!1;this._currentOffset.equals(this._shape.offset)||(this._currentOffset.copy(this._shape.offset),t=!0),this._currentNormal.equals(this._shape.normal)||(this._currentNormal.copy(this._shape.normal),t=!0),t&&this._buildPosition()}_buildPosition(){this._attrPos.setXYZ(0,-.5,-.5,0),this._attrPos.setXYZ(1,.5,-.5,0),this._attrPos.setXYZ(2,.5,.5,0),this._attrPos.setXYZ(3,-.5,.5,0),this._attrPos.setXYZ(4,0,0,0),this._attrPos.setXYZ(5,0,0,.25),this.translate(this._currentOffset.x,this._currentOffset.y,this._currentOffset.z),this.lookAt(this._currentNormal),this._attrPos.needsUpdate=!0}_buildIndex(){this._attrIndex.setXY(0,0,1),this._attrIndex.setXY(2,1,2),this._attrIndex.setXY(4,2,3),this._attrIndex.setXY(6,3,0),this._attrIndex.setXY(8,4,5),this._attrIndex.needsUpdate=!0}},bo=class extends Ee.BufferGeometry{constructor(t){super(),this.worldScale=1,this._currentRadius=0,this._currentOffset=new Ee.Vector3,this._shape=t,this._attrPos=new Ee.BufferAttribute(new Float32Array(288),3),this.setAttribute("position",this._attrPos),this._attrIndex=new Ee.BufferAttribute(new Uint16Array(192),1),this.setIndex(this._attrIndex),this._buildIndex(),this.update()}update(){let t=!1,e=this._shape.radius/this.worldScale;this._currentRadius!==e&&(this._currentRadius=e,t=!0),this._currentOffset.equals(this._shape.offset)||(this._currentOffset.copy(this._shape.offset),t=!0),t&&this._buildPosition()}_buildPosition(){for(let t=0;t<32;t++){let e=t/16*Math.PI;this._attrPos.setXYZ(t,Math.cos(e),Math.sin(e),0),this._attrPos.setXYZ(32+t,0,Math.cos(e),Math.sin(e)),this._attrPos.setXYZ(64+t,Math.sin(e),0,Math.cos(e))}this.scale(this._currentRadius,this._currentRadius,this._currentRadius),this.translate(this._currentOffset.x,this._currentOffset.y,this._currentOffset.z),this._attrPos.needsUpdate=!0}_buildIndex(){for(let t=0;t<32;t++){let e=(t+1)%32;this._attrIndex.setXY(t*2,t,e),this._attrIndex.setXY(64+t*2,32+t,32+e),this._attrIndex.setXY(128+t*2,64+t,64+e)}this._attrIndex.needsUpdate=!0}},Lo=new ae.Vector3,At=class extends ae.Group{constructor(t){if(super(),this.matrixAutoUpdate=!1,this.collider=t,this.collider.shape instanceof oi)this._geometry=new bo(this.collider.shape);else if(this.collider.shape instanceof ii)this._geometry=new wo(this.collider.shape);else if(this.collider.shape instanceof si)this._geometry=new So(this.collider.shape);else throw new Error("VRMSpringBoneColliderHelper: Unknown collider shape type detected");let e=new ae.LineBasicMaterial({color:16711935,depthTest:!1,depthWrite:!1});this._line=new ae.LineSegments(this._geometry,e),this.add(this._line)}dispose(){this._geometry.dispose()}updateMatrixWorld(t){this.collider.updateWorldMatrix(!0,!1),this.matrix.copy(this.collider.matrixWorld);let e=this.matrix.elements;this._geometry.worldScale=Lo.set(e[0],e[1],e[2]).length(),this._geometry.update(),super.updateMatrixWorld(t)}},Po=class extends Te.BufferGeometry{constructor(t){super(),this.worldScale=1,this._currentRadius=0,this._currentTail=new Te.Vector3,this._springBone=t,this._attrPos=new Te.BufferAttribute(new Float32Array(294),3),this.setAttribute("position",this._attrPos),this._attrIndex=new Te.BufferAttribute(new Uint16Array(194),1),this.setIndex(this._attrIndex),this._buildIndex(),this.update()}update(){let t=!1,e=this._springBone.settings.hitRadius/this.worldScale;this._currentRadius!==e&&(this._currentRadius=e,t=!0),this._currentTail.equals(this._springBone.initialLocalChildPosition)||(this._currentTail.copy(this._springBone.initialLocalChildPosition),t=!0),t&&this._buildPosition()}_buildPosition(){for(let t=0;t<32;t++){let e=t/16*Math.PI;this._attrPos.setXYZ(t,Math.cos(e),Math.sin(e),0),this._attrPos.setXYZ(32+t,0,Math.cos(e),Math.sin(e)),this._attrPos.setXYZ(64+t,Math.sin(e),0,Math.cos(e))}this.scale(this._currentRadius,this._currentRadius,this._currentRadius),this.translate(this._currentTail.x,this._currentTail.y,this._currentTail.z),this._attrPos.setXYZ(96,0,0,0),this._attrPos.setXYZ(97,this._currentTail.x,this._currentTail.y,this._currentTail.z),this._attrPos.needsUpdate=!0}_buildIndex(){for(let t=0;t<32;t++){let e=(t+1)%32;this._attrIndex.setXY(t*2,t,e),this._attrIndex.setXY(64+t*2,32+t,32+e),this._attrIndex.setXY(128+t*2,64+t,64+e)}this._attrIndex.setXY(192,96,97),this._attrIndex.needsUpdate=!0}},Io=new le.Vector3,Ho=class extends le.Group{constructor(t){super(),this.matrixAutoUpdate=!1,this.springBone=t,this._geometry=new Po(this.springBone);let e=new le.LineBasicMaterial({color:16776960,depthTest:!1,depthWrite:!1});this._line=new le.LineSegments(this._geometry,e),this.add(this._line)}dispose(){this._geometry.dispose()}updateMatrixWorld(t){this.springBone.bone.updateWorldMatrix(!0,!1),this.matrix.copy(this.springBone.bone.matrixWorld);let e=this.matrix.elements;this._geometry.worldScale=Io.set(e[0],e[1],e[2]).length(),this._geometry.update(),super.updateMatrixWorld(t)}},ke=class extends ut.Object3D{constructor(t){super(),this.colliderMatrix=new ut.Matrix4,this.shape=t}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),No(this.colliderMatrix,this.matrixWorld,this.shape.offset)}};function No(t,e,n){let r=e.elements;t.copy(e),n&&(t.elements[12]=r[0]*n.x+r[4]*n.y+r[8]*n.z+r[12],t.elements[13]=r[1]*n.x+r[5]*n.y+r[9]*n.z+r[13],t.elements[14]=r[2]*n.x+r[6]*n.y+r[10]*n.z+r[14])}var Oo=new ri.Matrix4;function Co(t){return t.invert?t.invert():t.getInverse(Oo.copy(t)),t}var Uo=class{constructor(t){this._inverseCache=new ni.Matrix4,this._shouldUpdateInverse=!0,this.matrix=t;let e={set:(n,r,i)=>(this._shouldUpdateInverse=!0,n[r]=i,!0)};this._originalElements=t.elements,t.elements=new Proxy(t.elements,e)}get inverse(){return this._shouldUpdateInverse&&(Co(this._inverseCache.copy(this.matrix)),this._shouldUpdateInverse=!1),this._inverseCache}revert(){this.matrix.elements=this._originalElements}},yt=new B.Matrix4,ye=new B.Vector3,Ve=new B.Vector3,Be=new B.Vector3,De=new B.Vector3,Vo=new B.Matrix4,Wt=class{constructor(t,e,n={},r=[]){this._currentTail=new B.Vector3,this._prevTail=new B.Vector3,this._boneAxis=new B.Vector3,this._worldSpaceBoneLength=0,this._center=null,this._initialLocalMatrix=new B.Matrix4,this._initialLocalRotation=new B.Quaternion,this._initialLocalChildPosition=new B.Vector3;var i,s,o,l,a,u;this.bone=t,this.bone.matrixAutoUpdate=!1,this.child=e,this.settings={hitRadius:(i=n.hitRadius)!=null?i:0,stiffness:(s=n.stiffness)!=null?s:1,gravityPower:(o=n.gravityPower)!=null?o:0,gravityDir:(a=(l=n.gravityDir)==null?void 0:l.clone())!=null?a:new B.Vector3(0,-1,0),dragForce:(u=n.dragForce)!=null?u:.4},this.colliderGroups=r}get dependencies(){let t=new Set,e=this.bone.parent;e&&t.add(e);for(let n=0;n<this.colliderGroups.length;n++)for(let r=0;r<this.colliderGroups[n].colliders.length;r++)t.add(this.colliderGroups[n].colliders[r]);return t}get center(){return this._center}set center(t){var e;(e=this._center)!=null&&e.userData.inverseCacheProxy&&(this._center.userData.inverseCacheProxy.revert(),delete this._center.userData.inverseCacheProxy),this._center=t,this._center&&(this._center.userData.inverseCacheProxy||(this._center.userData.inverseCacheProxy=new Uo(this._center.matrixWorld)))}get initialLocalChildPosition(){return this._initialLocalChildPosition}get _parentMatrixWorld(){return this.bone.parent?this.bone.parent.matrixWorld:yt}setInitState(){this._initialLocalMatrix.copy(this.bone.matrix),this._initialLocalRotation.copy(this.bone.quaternion),this.child?this._initialLocalChildPosition.copy(this.child.position):this._initialLocalChildPosition.copy(this.bone.position).normalize().multiplyScalar(.07);let t=this._getMatrixWorldToCenter();this.bone.localToWorld(this._currentTail.copy(this._initialLocalChildPosition)).applyMatrix4(t),this._prevTail.copy(this._currentTail),this._boneAxis.copy(this._initialLocalChildPosition).normalize()}reset(){this.bone.quaternion.copy(this._initialLocalRotation),this.bone.updateMatrix(),this.bone.matrixWorld.multiplyMatrices(this._parentMatrixWorld,this.bone.matrix);let t=this._getMatrixWorldToCenter();this.bone.localToWorld(this._currentTail.copy(this._initialLocalChildPosition)).applyMatrix4(t),this._prevTail.copy(this._currentTail)}update(t){if(t<=0)return;this._calcWorldSpaceBoneLength();let e=Ve.copy(this._boneAxis).transformDirection(this._initialLocalMatrix).transformDirection(this._parentMatrixWorld);De.copy(this._currentTail).add(ye.subVectors(this._currentTail,this._prevTail).multiplyScalar(1-this.settings.dragForce)).applyMatrix4(this._getMatrixCenterToWorld()).addScaledVector(e,this.settings.stiffness*t).addScaledVector(this.settings.gravityDir,this.settings.gravityPower*t),Be.setFromMatrixPosition(this.bone.matrixWorld),De.sub(Be).normalize().multiplyScalar(this._worldSpaceBoneLength).add(Be),this._collision(De),this._prevTail.copy(this._currentTail),this._currentTail.copy(De).applyMatrix4(this._getMatrixWorldToCenter());let n=Vo.multiplyMatrices(this._parentMatrixWorld,this._initialLocalMatrix).invert();this.bone.quaternion.setFromUnitVectors(this._boneAxis,ye.copy(De).applyMatrix4(n).normalize()).premultiply(this._initialLocalRotation),this.bone.updateMatrix(),this.bone.matrixWorld.multiplyMatrices(this._parentMatrixWorld,this.bone.matrix)}_collision(t){for(let e=0;e<this.colliderGroups.length;e++)for(let n=0;n<this.colliderGroups[e].colliders.length;n++){let r=this.colliderGroups[e].colliders[n],i=r.shape.calculateCollision(r.colliderMatrix,t,this.settings.hitRadius,ye);if(i<0){t.addScaledVector(ye,-i),t.sub(Be);let s=t.length();t.multiplyScalar(this._worldSpaceBoneLength/s).add(Be)}}}_calcWorldSpaceBoneLength(){ye.setFromMatrixPosition(this.bone.matrixWorld),this.child?Ve.setFromMatrixPosition(this.child.matrixWorld):(Ve.copy(this._initialLocalChildPosition),Ve.applyMatrix4(this.bone.matrixWorld)),this._worldSpaceBoneLength=ye.sub(Ve).length()}_getMatrixCenterToWorld(){return this._center?this._center.matrixWorld:yt}_getMatrixWorldToCenter(){return this._center?this._center.userData.inverseCacheProxy.inverse:yt}};function Bo(t,e){let n=[],r=t;for(;r!==null;)n.unshift(r),r=r.parent;n.forEach(i=>{e(i)})}function Nt(t,e){t.children.forEach(n=>{e(n)||Nt(n,e)})}function Do(t){var e;let n=new Map;for(let r of t){let i=r;do{let s=((e=n.get(i))!=null?e:0)+1;if(s===t.size)return i;n.set(i,s),i=i.parent}while(i!==null)}return null}var it=class{constructor(){this._joints=new Set,this._sortedJoints=[],this._hasWarnedCircularDependency=!1,this._ancestors=[],this._objectSpringBonesMap=new Map,this._isSortedJointsDirty=!1,this._relevantChildrenUpdated=this._relevantChildrenUpdated.bind(this)}get joints(){return this._joints}get springBones(){return console.warn("VRMSpringBoneManager: springBones is deprecated. use joints instead."),this._joints}get colliderGroups(){let t=new Set;return this._joints.forEach(e=>{e.colliderGroups.forEach(n=>{t.add(n)})}),Array.from(t)}get colliders(){let t=new Set;return this.colliderGroups.forEach(e=>{e.colliders.forEach(n=>{t.add(n)})}),Array.from(t)}addJoint(t){this._joints.add(t);let e=this._objectSpringBonesMap.get(t.bone);e==null&&(e=new Set,this._objectSpringBonesMap.set(t.bone,e)),e.add(t),this._isSortedJointsDirty=!0}addSpringBone(t){console.warn("VRMSpringBoneManager: addSpringBone() is deprecated. use addJoint() instead."),this.addJoint(t)}deleteJoint(t){this._joints.delete(t),this._objectSpringBonesMap.get(t.bone).delete(t),this._isSortedJointsDirty=!0}deleteSpringBone(t){console.warn("VRMSpringBoneManager: deleteSpringBone() is deprecated. use deleteJoint() instead."),this.deleteJoint(t)}setInitState(){this._sortJoints();for(let t=0;t<this._sortedJoints.length;t++){let e=this._sortedJoints[t];e.bone.updateMatrix(),e.bone.updateWorldMatrix(!1,!1),e.setInitState()}}reset(){this._sortJoints();for(let t=0;t<this._sortedJoints.length;t++){let e=this._sortedJoints[t];e.bone.updateMatrix(),e.bone.updateWorldMatrix(!1,!1),e.reset()}}update(t){this._sortJoints();for(let e=0;e<this._ancestors.length;e++)this._ancestors[e].updateWorldMatrix(e===0,!1);for(let e=0;e<this._sortedJoints.length;e++){let n=this._sortedJoints[e];n.bone.updateMatrix(),n.bone.updateWorldMatrix(!1,!1),n.update(t),Nt(n.bone,this._relevantChildrenUpdated)}}_sortJoints(){if(!this._isSortedJointsDirty)return;let t=[],e=new Set,n=new Set,r=new Set;for(let s of this._joints)this._insertJointSort(s,e,n,t,r);this._sortedJoints=t;let i=Do(r);this._ancestors=[],i&&(this._ancestors.push(i),Nt(i,s=>{var o,l;return((l=(o=this._objectSpringBonesMap.get(s))==null?void 0:o.size)!=null?l:0)>0?!0:(this._ancestors.push(s),!1)})),this._isSortedJointsDirty=!1}_insertJointSort(t,e,n,r,i){if(n.has(t))return;if(e.has(t)){this._hasWarnedCircularDependency||(console.warn("VRMSpringBoneManager: Circular dependency detected"),this._hasWarnedCircularDependency=!0);return}e.add(t);let s=t.dependencies;for(let o of s){let l=!1,a=null;Bo(o,u=>{let d=this._objectSpringBonesMap.get(u);if(d)for(let c of d)l=!0,this._insertJointSort(c,e,n,r,i);else l||(a=u)}),a&&i.add(a)}r.push(t),n.add(t)}_relevantChildrenUpdated(t){var e,n;return((n=(e=this._objectSpringBonesMap.get(t))==null?void 0:e.size)!=null?n:0)>0?!0:(t.updateWorldMatrix(!1,!1),!1)}},Lr="VRMC_springBone_extended_collider",Fo=new Set(["1.0","1.0-beta"]),ko=new Set(["1.0"]),ai=class Se{get name(){return Se.EXTENSION_NAME}constructor(e,n){var r;this.parser=e,this.jointHelperRoot=n?.jointHelperRoot,this.colliderHelperRoot=n?.colliderHelperRoot,this.useExtendedColliders=(r=n?.useExtendedColliders)!=null?r:!0}afterRoot(e){return $e(this,null,function*(){e.userData.vrmSpringBoneManager=yield this._import(e)})}_import(e){return $e(this,null,function*(){let n=yield this._v1Import(e);if(n!=null)return n;let r=yield this._v0Import(e);return r??null})}_v1Import(e){return $e(this,null,function*(){var n,r,i,s,o;let l=e.parser.json;if(!(((n=l.extensionsUsed)==null?void 0:n.indexOf(Se.EXTENSION_NAME))!==-1))return null;let u=new it,d=yield e.parser.getDependencies("node"),c=(r=l.extensions)==null?void 0:r[Se.EXTENSION_NAME];if(!c)return null;let h=c.specVersion;if(!Fo.has(h))return console.warn(`VRMSpringBoneLoaderPlugin: Unknown ${Se.EXTENSION_NAME} specVersion "${h}"`),null;let p=(i=c.colliders)==null?void 0:i.map((g,_)=>{var v,T,x,E,M,y,w,b,H,I,O,V,ne,He,Ne;let $=d[g.node];if($==null)return console.warn(`VRMSpringBoneLoaderPlugin: The collider #${_} attempted to reference a node #${g.node} but not found. Skipping the collider`),null;let q=g.shape,Re=(v=g.extensions)==null?void 0:v[Lr];if(this.useExtendedColliders&&Re!=null){let Oe=Re.specVersion;if(!ko.has(Oe))console.warn(`VRMSpringBoneLoaderPlugin: Unknown ${Lr} specVersion "${Oe}". Fallbacking to the ${Se.EXTENSION_NAME} definition`);else{let D=Re.shape;if(D.sphere)return this._importSphereCollider($,{offset:new G.Vector3().fromArray((T=D.sphere.offset)!=null?T:[0,0,0]),radius:(x=D.sphere.radius)!=null?x:0,inside:(E=D.sphere.inside)!=null?E:!1});if(D.capsule)return this._importCapsuleCollider($,{offset:new G.Vector3().fromArray((M=D.capsule.offset)!=null?M:[0,0,0]),radius:(y=D.capsule.radius)!=null?y:0,tail:new G.Vector3().fromArray((w=D.capsule.tail)!=null?w:[0,0,0]),inside:(b=D.capsule.inside)!=null?b:!1});if(D.plane)return this._importPlaneCollider($,{offset:new G.Vector3().fromArray((H=D.plane.offset)!=null?H:[0,0,0]),normal:new G.Vector3().fromArray((I=D.plane.normal)!=null?I:[0,0,1])})}}if(q.sphere)return this._importSphereCollider($,{offset:new G.Vector3().fromArray((O=q.sphere.offset)!=null?O:[0,0,0]),radius:(V=q.sphere.radius)!=null?V:0,inside:!1});if(q.capsule)return this._importCapsuleCollider($,{offset:new G.Vector3().fromArray((ne=q.capsule.offset)!=null?ne:[0,0,0]),radius:(He=q.capsule.radius)!=null?He:0,tail:new G.Vector3().fromArray((Ne=q.capsule.tail)!=null?Ne:[0,0,0]),inside:!1});console.warn(`VRMSpringBoneLoaderPlugin: The collider #${_} has no valid shape. Skipping the collider`)}),m=(s=c.colliderGroups)==null?void 0:s.map((g,_)=>{var v;return{colliders:((v=g.colliders)!=null?v:[]).map(x=>{let E=p?.[x];return E??(console.warn(`VRMSpringBoneLoaderPlugin: The collider group #${_} attempted to reference a collider #${x} but not found. Skipping the collider`),null)}).filter(x=>x!=null),name:g.name}});return(o=c.springs)==null||o.forEach((g,_)=>{var v;let T=g.joints,x=(v=g.colliderGroups)==null?void 0:v.map(y=>{let w=m?.[y];return w??(console.warn(`VRMSpringBoneLoaderPlugin: The spring #${_} attempted to reference a collider group #${y} but not found. Skipping the collider group`),null)}).filter(y=>y!=null),E=g.center!=null?d[g.center]:void 0,M;T.forEach(y=>{if(M){let w=M.node,b=d[w],H=y.node,I=d[H],O={hitRadius:M.hitRadius,dragForce:M.dragForce,gravityPower:M.gravityPower,stiffness:M.stiffness,gravityDir:M.gravityDir!=null?new G.Vector3().fromArray(M.gravityDir):void 0},V=this._importJoint(b,I,O,x);E&&(V.center=E),u.addJoint(V)}M=y})}),u.setInitState(),u})}_v0Import(e){return $e(this,null,function*(){var n,r,i;let s=e.parser.json;if(!(((n=s.extensionsUsed)==null?void 0:n.indexOf("VRM"))!==-1))return null;let l=(r=s.extensions)==null?void 0:r.VRM,a=l?.secondaryAnimation;if(!a)return null;let u=a?.boneGroups;if(!u)return null;let d=new it,c=yield e.parser.getDependencies("node"),h=(i=a.colliderGroups)==null?void 0:i.map((p,m)=>{var g;let _=c[p.node];return _==null?(console.warn(`VRMSpringBoneLoaderPlugin: The collider group #${m} attempted to reference a node #${p.node} but not found. Skipping the collider group`),null):{colliders:((g=p.colliders)!=null?g:[]).map((T,x)=>{var E,M,y;let w=new G.Vector3(0,0,0);return T.offset&&w.set((E=T.offset.x)!=null?E:0,(M=T.offset.y)!=null?M:0,T.offset.z?-T.offset.z:0),this._importSphereCollider(_,{offset:w,radius:(y=T.radius)!=null?y:0,inside:!1})})}});return u?.forEach((p,m)=>{let g=p.bones;g&&g.forEach(_=>{var v,T,x,E;let M=c[_];if(M==null){console.warn(`VRMSpringBoneLoaderPlugin: The spring bone group #${m} attempted to reference a node #${_} but not found. Skipping the node`);return}let y=new G.Vector3;p.gravityDir?y.set((v=p.gravityDir.x)!=null?v:0,(T=p.gravityDir.y)!=null?T:0,(x=p.gravityDir.z)!=null?x:0):y.set(0,-1,0);let w=p.center!=null?c[p.center]:void 0,b={hitRadius:p.hitRadius,dragForce:p.dragForce,gravityPower:p.gravityPower,stiffness:p.stiffiness,gravityDir:y},H=(E=p.colliderGroups)==null?void 0:E.map(I=>{let O=h?.[I];return O??(console.warn(`VRMSpringBoneLoaderPlugin: The spring #${m} attempted to reference a collider group #${I} but not found. Skipping the collider group`),null)}).filter(I=>I!=null);M.traverse(I=>{var O;let V=(O=I.children[0])!=null?O:null,ne=this._importJoint(I,V,b,H);w&&(ne.center=w),d.addJoint(ne)})})}),e.scene.updateMatrixWorld(),d.setInitState(),d})}_importJoint(e,n,r,i){let s=new Wt(e,n,r,i);if(this.jointHelperRoot){let o=new Ho(s);this.jointHelperRoot.add(o),o.renderOrder=this.jointHelperRoot.renderOrder}return s}_importSphereCollider(e,n){let r=new oi(n),i=new ke(r);if(e.add(i),this.colliderHelperRoot){let s=new At(i);this.colliderHelperRoot.add(s),s.renderOrder=this.colliderHelperRoot.renderOrder}return i}_importCapsuleCollider(e,n){let r=new ii(n),i=new ke(r);if(e.add(i),this.colliderHelperRoot){let s=new At(i);this.colliderHelperRoot.add(s),s.renderOrder=this.colliderHelperRoot.renderOrder}return i}_importPlaneCollider(e,n){let r=new si(n),i=new ke(r);if(e.add(i),this.colliderHelperRoot){let s=new At(i);this.colliderHelperRoot.add(s),s.renderOrder=this.colliderHelperRoot.renderOrder}return i}};ai.EXTENSION_NAME="VRMC_springBone";var Wo=ai,li=class{get name(){return"VRMLoaderPlugin"}constructor(t,e){var n,r,i,s,o,l,a,u,d,c;this.parser=t;let h=e?.helperRoot,p=e?.autoUpdateHumanBones;this.expressionPlugin=(n=e?.expressionPlugin)!=null?n:new os(t),this.firstPersonPlugin=(r=e?.firstPersonPlugin)!=null?r:new ls(t),this.humanoidPlugin=(i=e?.humanoidPlugin)!=null?i:new ms(t,{helperRoot:h,autoUpdateHumanBones:p}),this.lookAtPlugin=(s=e?.lookAtPlugin)!=null?s:new Ps(t,{helperRoot:h}),this.metaPlugin=(o=e?.metaPlugin)!=null?o:new Ns(t),this.mtoonMaterialPlugin=(l=e?.mtoonMaterialPlugin)!=null?l:new qs(t),this.materialsHDREmissiveMultiplierPlugin=(a=e?.materialsHDREmissiveMultiplierPlugin)!=null?a:new Qs(t),this.materialsV0CompatPlugin=(u=e?.materialsV0CompatPlugin)!=null?u:new no(t),this.springBonePlugin=(d=e?.springBonePlugin)!=null?d:new Wo(t,{colliderHelperRoot:h,jointHelperRoot:h}),this.nodeConstraintPlugin=(c=e?.nodeConstraintPlugin)!=null?c:new Ao(t,{helperRoot:h})}beforeRoot(){return Qe(this,null,function*(){yield this.materialsV0CompatPlugin.beforeRoot(),yield this.mtoonMaterialPlugin.beforeRoot()})}loadMesh(t){return Qe(this,null,function*(){return yield this.mtoonMaterialPlugin.loadMesh(t)})}getMaterialType(t){let e=this.mtoonMaterialPlugin.getMaterialType(t);return e??null}extendMaterialParams(t,e){return Qe(this,null,function*(){yield this.materialsHDREmissiveMultiplierPlugin.extendMaterialParams(t,e),yield this.mtoonMaterialPlugin.extendMaterialParams(t,e)})}afterRoot(t){return Qe(this,null,function*(){yield this.metaPlugin.afterRoot(t),yield this.humanoidPlugin.afterRoot(t),yield this.expressionPlugin.afterRoot(t),yield this.lookAtPlugin.afterRoot(t),yield this.firstPersonPlugin.afterRoot(t),yield this.springBonePlugin.afterRoot(t),yield this.nodeConstraintPlugin.afterRoot(t),yield this.mtoonMaterialPlugin.afterRoot(t);let e=t.userData.vrmMeta,n=t.userData.vrmHumanoid;if(e&&n){let r=new Cs({scene:t.scene,expressionManager:t.userData.vrmExpressionManager,firstPerson:t.userData.vrmFirstPerson,humanoid:n,lookAt:t.userData.vrmLookAt,meta:e,materials:t.userData.vrmMToonMaterials,springBoneManager:t.userData.vrmSpringBoneManager,nodeConstraintManager:t.userData.vrmNodeConstraintManager});t.userData.vrm=r}})}};function Go(t){let e=new Set;return t.traverse(n=>{if(!n.isMesh)return;let r=n;e.add(r)}),e}function Pr(t,e,n){if(e.size===1){let o=e.values().next().value;if(o.weight===1)return t[o.index]}let r=new Float32Array(t[0].count*3),i=0;if(n)i=1;else for(let o of e)i+=o.weight;for(let o of e){let l=t[o.index],a=o.weight/i;for(let u=0;u<l.count;u++)r[u*3+0]+=l.getX(u)*a,r[u*3+1]+=l.getY(u)*a,r[u*3+2]+=l.getZ(u)*a}return new ui.BufferAttribute(r,3)}function zo(t){var e;let n=Go(t.scene),r=new Map,i=(e=t.expressionManager)==null?void 0:e.expressionMap;if(i!=null)for(let[s,o]of Object.entries(i)){let l=new Set;for(let a of o.binds)if(a instanceof be){if(a.weight!==0)for(let u of a.primitives){let d=r.get(u);d==null&&(d=new Map,r.set(u,d));let c=d.get(s);c==null&&(c=new Set,d.set(s,c)),c.add(a)}l.add(a)}for(let a of l)o.deleteBind(a)}for(let s of n){let o=r.get(s);if(o==null)continue;let l=s.geometry.morphAttributes;s.geometry.morphAttributes={};let a=s.geometry.clone();s.geometry=a;let u=a.morphTargetsRelative,d=l.position!=null,c=l.normal!=null,h={},p={},m=[];if(d||c){d&&(h.position=[]),c&&(h.normal=[]);let g=0;for(let[_,v]of o)d&&(h.position[g]=Pr(l.position,v,u)),c&&(h.normal[g]=Pr(l.normal,v,u)),i?.[_].addBind(new be({index:g,weight:1,primitives:[s]})),p[_]=g,m.push(0),g++}a.morphAttributes=h,s.morphTargetDictionary=p,s.morphTargetInfluences=m}}function st(t,e,n){if(t.getComponent)return t.getComponent(e,n);{let r=t.array[e*t.itemSize+n];return t.normalized&&(r=ci.MathUtils.denormalize(r,t.array)),r}}function hi(t,e,n,r){t.setComponent?t.setComponent(e,n,r):(t.normalized&&(r=di.MathUtils.normalize(r,t.array)),t.array[e*t.itemSize+n]=r)}function jo(t){var e;let n=Xo(t),r=new Set;for(let c of n)r.has(c.geometry)&&(c.geometry=$o(c.geometry)),r.add(c.geometry);let i=new Map;for(let c of r){let h=c.getAttribute("skinIndex"),p=(e=i.get(h))!=null?e:new Map;i.set(h,p);let m=c.getAttribute("skinWeight"),g=qo(h,m);p.set(m,g)}let s=new Map;for(let c of n){let h=Yo(c,i);s.set(c,h)}let o=[];for(let[c,h]of s){let p=!1;for(let m of o)if(Qo(h,m.boneInverseMap)){p=!0,m.meshes.add(c);for(let[_,v]of h)m.boneInverseMap.set(_,v);break}p||o.push({boneInverseMap:h,meshes:new Set([c])})}let l=new Map,a=new wt,u=new wt,d=new wt;for(let c of o){let{boneInverseMap:h,meshes:p}=c,m=Array.from(h.keys()),g=Array.from(h.values()),_=new Pe.Skeleton(m,g),v=u.getOrCreate(_);for(let T of p){let x=T.geometry.getAttribute("skinIndex"),E=a.getOrCreate(x),M=T.skeleton.bones,y=M.map(H=>d.getOrCreate(H)).join(","),w=`${E};${v};${y}`,b=l.get(w);b==null&&(b=x.clone(),Ko(b,M,m),l.set(w,b)),T.geometry.setAttribute("skinIndex",b)}for(let T of p)T.bind(_,new Pe.Matrix4)}}function Xo(t){let e=new Set;return t.traverse(n=>{if(!n.isSkinnedMesh)return;let r=n;e.add(r)}),e}function qo(t,e){let n=new Set;for(let r=0;r<t.count;r++)for(let i=0;i<t.itemSize;i++){let s=st(t,r,i);st(e,r,i)!==0&&n.add(s)}return n}function Yo(t,e){let n=new Map,r=t.skeleton,i=t.geometry,s=i.getAttribute("skinIndex"),o=i.getAttribute("skinWeight"),l=e.get(s),a=l?.get(o);if(!a)throw new Error("Unreachable. attributeUsedIndexSetMap does not know the skin index attribute or the skin weight attribute.");for(let u of a)n.set(r.bones[u],r.boneInverses[u]);return n}function Qo(t,e){for(let[n,r]of t.entries()){let i=e.get(n);if(i!=null&&!Zo(r,i))return!1}return!0}function Ko(t,e,n){let r=new Map;for(let s of e)r.set(s,r.size);let i=new Map;for(let[s,o]of n.entries()){let l=r.get(o);i.set(l,s)}for(let s=0;s<t.count;s++)for(let o=0;o<t.itemSize;o++){let l=st(t,s,o),a=i.get(l);hi(t,s,o,a)}t.needsUpdate=!0}function Zo(t,e,n){if(n=n||1e-4,t.elements.length!=e.elements.length)return!1;for(let r=0,i=t.elements.length;r<i;r++)if(Math.abs(t.elements[r]-e.elements[r])>n)return!1;return!0}var wt=class{constructor(){this._objectIndexMap=new Map,this._index=0}get(t){return this._objectIndexMap.get(t)}getOrCreate(t){let e=this._objectIndexMap.get(t);return e==null&&(e=this._index,this._objectIndexMap.set(t,e),this._index++),e}};function $o(t){var e,n,r,i;let s=new Pe.BufferGeometry;s.name=t.name,s.setIndex(t.index);for(let[o,l]of Object.entries(t.attributes))s.setAttribute(o,l);for(let[o,l]of Object.entries(t.morphAttributes)){let a=o;s.morphAttributes[a]=l.concat()}s.morphTargetsRelative=t.morphTargetsRelative,s.groups=[];for(let o of t.groups)s.addGroup(o.start,o.count,o.materialIndex);return s.boundingSphere=(n=(e=t.boundingSphere)==null?void 0:e.clone())!=null?n:null,s.boundingBox=(i=(r=t.boundingBox)==null?void 0:r.clone())!=null?i:null,s.drawRange.start=t.drawRange.start,s.drawRange.count=t.drawRange.count,s.userData=t.userData,s}function Ir(t){if(Object.values(t).forEach(e=>{e?.isTexture&&e.dispose()}),t.isShaderMaterial){let e=t.uniforms;e&&Object.values(e).forEach(n=>{let r=n.value;r?.isTexture&&r.dispose()})}t.dispose()}function Jo(t){let e=t.geometry;e&&e.dispose();let n=t.skeleton;n&&n.dispose();let r=t.material;r&&(Array.isArray(r)?r.forEach(i=>Ir(i)):r&&Ir(r))}function ea(t){t.traverse(Jo)}function ta(t,e){var n,r;console.warn("VRMUtils.removeUnnecessaryJoints: removeUnnecessaryJoints is deprecated. Use combineSkeletons instead. combineSkeletons contributes more to the performance improvement. This function will be removed in the next major version.");let i=(n=e?.experimentalSameBoneCounts)!=null?n:!1,s=[];t.traverse(a=>{a.type==="SkinnedMesh"&&s.push(a)});let o=new Map,l=0;for(let a of s){let d=a.geometry.getAttribute("skinIndex");if(o.has(d))continue;let c=new Map,h=new Map;for(let p=0;p<d.count;p++)for(let m=0;m<d.itemSize;m++){let g=st(d,p,m),_=c.get(g);_==null&&(_=c.size,c.set(g,_),h.set(_,g)),hi(d,p,m,_)}d.needsUpdate=!0,o.set(d,h),l=Math.max(l,c.size)}for(let a of s){let d=a.geometry.getAttribute("skinIndex"),c=o.get(d),h=[],p=[],m=i?l:c.size;for(let _=0;_<m;_++){let v=(r=c.get(_))!=null?r:0;h.push(a.skeleton.bones[v]),p.push(a.skeleton.boneInverses[v])}let g=new ct.Skeleton(h,p);a.bind(g,new ct.Matrix4)}}function na(t,e){let n=t.position.count,r=new Array(n),i=0,s=e.array;for(let o=0;o<s.length;o++){let l=s[o];r[l]||(r[l]=!0,i++)}return{isVertexUsed:r,vertexCount:n,verticesUsed:i}}function ra(t){let e=[],n=[],r=0;for(let i=0;i<t.length;i++)if(t[i]){let s=r++;e[i]=s,n[s]=i}return{originalIndexNewIndexMap:e,newIndexOriginalIndexMap:n}}function ia(t,e){var n,r,i,s;e.name=t.name,e.morphTargetsRelative=t.morphTargetsRelative,t.groups.forEach(o=>{e.addGroup(o.start,o.count,o.materialIndex)}),e.boundingBox=(r=(n=t.boundingBox)==null?void 0:n.clone())!=null?r:null,e.boundingSphere=(s=(i=t.boundingSphere)==null?void 0:i.clone())!=null?s:null,e.setDrawRange(t.drawRange.start,t.drawRange.count),e.userData=t.userData}function sa(t,e,n){let r=e.array,i=new r.constructor(r.length);for(let s=0;s<r.length;s++){let o=r[s];i[s]=n[o]}t.setIndex(new dt.BufferAttribute(i,e.itemSize,e.normalized))}function ot(t,e,n){let r=t.constructor,i=new r(e.length*n),s=!0;for(let o=0;o<e.length;o++){let a=e[o]*n,u=o*n;for(let d=0;d<n;d++){let c=t[a+d];i[u+d]=c,s=s&&c===0}}return[i,s]}function oa(t){var e;let n=new Map,r=[];for(let[i,s]of Object.entries(t))if(s.isInterleavedBufferAttribute){let o=s,l=o.data,a=(e=n.get(l))!=null?e:[];n.set(l,a),a.push([i,o])}else{let o=s;r.push([i,o])}return[n,r]}function aa(t,e,n){let[r,i]=oa(e);for(let[s,o]of r){let l=s.array,{stride:a}=s,[u,d]=ot(l,n,a),c=new ue.InterleavedBuffer(u,a);c.setUsage(s.usage);for(let[h,p]of o){let{itemSize:m,offset:g,normalized:_}=p,v=new ue.InterleavedBufferAttribute(c,m,g,_);t.setAttribute(h,v)}}for(let[s,o]of i){let l=o.array,{itemSize:a,normalized:u}=o,[d,c]=ot(l,n,a);t.setAttribute(s,new dt.BufferAttribute(d,a,u))}}function la(t){var e;let n=new Map,r=[];for(let[i,s]of Object.entries(t)){let o=i;for(let l=0;l<s.length;l++){let a=s[l];if(a.isInterleavedBufferAttribute){let u=a,d=u.data,c=(e=n.get(d))!=null?e:[];n.set(d,c),c.push([o,l,u])}else{let u=a;r.push([o,l,u])}}}return[n,r]}function ua(t,e,n){var r,i;let s=!0,[o,l]=la(e),a={};for(let[u,d]of o){let c=u.array,{stride:h}=u,[p,m]=ot(c,n,h);s=s&&m;let g=new ue.InterleavedBuffer(p,h);g.setUsage(u.usage);for(let[_,v,T]of d){let{itemSize:x,offset:E,normalized:M}=T,y=new ue.InterleavedBufferAttribute(g,x,E,M);(r=a[_])!=null||(a[_]=[]),a[_][v]=y}}for(let[u,d,c]of l){let h=c,p=h.array,{itemSize:m,normalized:g}=h,[_,v]=ot(p,n,m);s=s&&v,(i=a[u])!=null||(a[u]=[]),a[u][d]=new dt.BufferAttribute(_,m,g)}t.morphAttributes=s?{}:a}function ca(t){let e=new Map;t.traverse(n=>{if(!n.isMesh)return;let r=n,i=r.geometry,s=i.index;if(s==null)return;let o=e.get(i);if(o!=null){r.geometry=o;return}let{isVertexUsed:l,vertexCount:a,verticesUsed:u}=na(i.attributes,s);if(u===a)return;let{originalIndexNewIndexMap:d,newIndexOriginalIndexMap:c}=ra(l),h=new ue.BufferGeometry;ia(i,h),e.set(i,h),sa(h,s,d),aa(h,i.attributes,c),ua(h,i.morphAttributes,c),r.geometry=h}),Array.from(e.keys()).forEach(n=>{n.dispose()})}function da(t){var e;((e=t.meta)==null?void 0:e.metaVersion)==="0"&&(t.scene.rotation.y=Math.PI)}var ce=class{constructor(){}};ce.combineMorphs=zo;ce.combineSkeletons=jo;ce.deepDispose=ea;ce.removeUnnecessaryJoints=ta;ce.removeUnnecessaryVertices=ca;ce.rotateVRM0=da;/*!
 * @pixiv/three-vrm-core v3.5.5
 * The implementation of core features of VRM, for @pixiv/three-vrm
 *
 * Copyright (c) 2019-2026 pixiv Inc.
 * @pixiv/three-vrm-core is distributed under MIT License
 * https://github.com/pixiv/three-vrm/blob/release/LICENSE
 *//*!
 * @pixiv/three-vrm-materials-mtoon v3.5.5
 * MToon (toon material) module for @pixiv/three-vrm
 *
 * Copyright (c) 2019-2026 pixiv Inc.
 * @pixiv/three-vrm-materials-mtoon is distributed under MIT License
 * https://github.com/pixiv/three-vrm/blob/release/LICENSE
 *//*!
 * @pixiv/three-vrm-materials-hdr-emissive-multiplier v3.5.5
 * Support VRMC_hdr_emissiveMultiplier for @pixiv/three-vrm
 *
 * Copyright (c) 2019-2026 pixiv Inc.
 * @pixiv/three-vrm-materials-hdr-emissive-multiplier is distributed under MIT License
 * https://github.com/pixiv/three-vrm/blob/release/LICENSE
 *//*!
 * @pixiv/three-vrm-materials-v0compat v3.5.5
 * VRM0.0 materials compatibility layer plugin for @pixiv/three-vrm
 *
 * Copyright (c) 2019-2026 pixiv Inc.
 * @pixiv/three-vrm-materials-v0compat is distributed under MIT License
 * https://github.com/pixiv/three-vrm/blob/release/LICENSE
 *//*!
 * @pixiv/three-vrm-node-constraint v3.5.5
 * Node constraint module for @pixiv/three-vrm
 *
 * Copyright (c) 2019-2026 pixiv Inc.
 * @pixiv/three-vrm-node-constraint is distributed under MIT License
 * https://github.com/pixiv/three-vrm/blob/release/LICENSE
 *//*!
 * @pixiv/three-vrm-springbone v3.5.5
 * Spring bone module for @pixiv/three-vrm
 *
 * Copyright (c) 2019-2026 pixiv Inc.
 * @pixiv/three-vrm-springbone is distributed under MIT License
 * https://github.com/pixiv/three-vrm/blob/release/LICENSE
 */var f=A(R(),1);var k=A(R(),1);function Gt(t,e){if(e===k.TrianglesDrawMode)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),t;if(e===k.TriangleFanDrawMode||e===k.TriangleStripDrawMode){let n=t.getIndex();if(n===null){let o=[],l=t.getAttribute("position");if(l!==void 0){for(let a=0;a<l.count;a++)o.push(a);t.setIndex(o),n=t.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),t}let r=n.count-2,i=[];if(e===k.TriangleFanDrawMode)for(let o=1;o<=r;o++)i.push(n.getX(0)),i.push(n.getX(o)),i.push(n.getX(o+1));else for(let o=0;o<r;o++)o%2===0?(i.push(n.getX(o)),i.push(n.getX(o+1)),i.push(n.getX(o+2))):(i.push(n.getX(o+2)),i.push(n.getX(o+1)),i.push(n.getX(o)));i.length/3!==r&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");let s=t.clone();return s.setIndex(i),s.clearGroups(),s}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),t}var ht=class extends f.Loader{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(n){return new Kt(n)}),this.register(function(n){return new on(n)}),this.register(function(n){return new an(n)}),this.register(function(n){return new ln(n)}),this.register(function(n){return new $t(n)}),this.register(function(n){return new Jt(n)}),this.register(function(n){return new en(n)}),this.register(function(n){return new tn(n)}),this.register(function(n){return new Qt(n)}),this.register(function(n){return new nn(n)}),this.register(function(n){return new Zt(n)}),this.register(function(n){return new sn(n)}),this.register(function(n){return new rn(n)}),this.register(function(n){return new qt(n)}),this.register(function(n){return new un(n)}),this.register(function(n){return new cn(n)})}load(e,n,r,i){let s=this,o;if(this.resourcePath!=="")o=this.resourcePath;else if(this.path!==""){let u=f.LoaderUtils.extractUrlBase(e);o=f.LoaderUtils.resolveURL(u,this.path)}else o=f.LoaderUtils.extractUrlBase(e);this.manager.itemStart(e);let l=function(u){i?i(u):console.error(u),s.manager.itemError(e),s.manager.itemEnd(e)},a=new f.FileLoader(this.manager);a.setPath(this.path),a.setResponseType("arraybuffer"),a.setRequestHeader(this.requestHeader),a.setWithCredentials(this.withCredentials),a.load(e,function(u){try{s.parse(u,o,function(d){n(d),s.manager.itemEnd(e)},l)}catch(d){l(d)}},r,l)}setDRACOLoader(e){return this.dracoLoader=e,this}setDDSLoader(){throw new Error('THREE.GLTFLoader: "MSFT_texture_dds" no longer supported. Please update to "KHR_texture_basisu".')}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,n,r,i){let s,o={},l={},a=new TextDecoder;if(typeof e=="string")s=JSON.parse(e);else if(e instanceof ArrayBuffer)if(a.decode(new Uint8Array(e,0,4))===_i){try{o[S.KHR_BINARY_GLTF]=new dn(e)}catch(c){i&&i(c);return}s=JSON.parse(o[S.KHR_BINARY_GLTF].content)}else s=JSON.parse(a.decode(e));else s=e;if(s.asset===void 0||s.asset.version[0]<2){i&&i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let u=new vn(s,{path:n||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});u.fileLoader.setRequestHeader(this.requestHeader);for(let d=0;d<this.pluginCallbacks.length;d++){let c=this.pluginCallbacks[d](u);c.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),l[c.name]=c,o[c.name]=!0}if(s.extensionsUsed)for(let d=0;d<s.extensionsUsed.length;++d){let c=s.extensionsUsed[d],h=s.extensionsRequired||[];switch(c){case S.KHR_MATERIALS_UNLIT:o[c]=new Yt;break;case S.KHR_DRACO_MESH_COMPRESSION:o[c]=new hn(s,this.dracoLoader);break;case S.KHR_TEXTURE_TRANSFORM:o[c]=new fn;break;case S.KHR_MESH_QUANTIZATION:o[c]=new pn;break;default:h.indexOf(c)>=0&&l[c]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+c+'".')}}u.setExtensions(o),u.setPlugins(l),u.parse(r,i)}parseAsync(e,n){let r=this;return new Promise(function(i,s){r.parse(e,n,i,s)})}};function ha(){let t={};return{get:function(e){return t[e]},add:function(e,n){t[e]=n},remove:function(e){delete t[e]},removeAll:function(){t={}}}}var S={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"},qt=class{constructor(e){this.parser=e,this.name=S.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,n=this.parser.json.nodes||[];for(let r=0,i=n.length;r<i;r++){let s=n[r];s.extensions&&s.extensions[this.name]&&s.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,s.extensions[this.name].light)}}_loadLight(e){let n=this.parser,r="light:"+e,i=n.cache.get(r);if(i)return i;let s=n.json,a=((s.extensions&&s.extensions[this.name]||{}).lights||[])[e],u,d=new f.Color(16777215);a.color!==void 0&&d.setRGB(a.color[0],a.color[1],a.color[2],f.LinearSRGBColorSpace);let c=a.range!==void 0?a.range:0;switch(a.type){case"directional":u=new f.DirectionalLight(d),u.target.position.set(0,0,-1),u.add(u.target);break;case"point":u=new f.PointLight(d),u.distance=c;break;case"spot":u=new f.SpotLight(d),u.distance=c,a.spot=a.spot||{},a.spot.innerConeAngle=a.spot.innerConeAngle!==void 0?a.spot.innerConeAngle:0,a.spot.outerConeAngle=a.spot.outerConeAngle!==void 0?a.spot.outerConeAngle:Math.PI/4,u.angle=a.spot.outerConeAngle,u.penumbra=1-a.spot.innerConeAngle/a.spot.outerConeAngle,u.target.position.set(0,0,-1),u.add(u.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+a.type)}return u.position.set(0,0,0),u.decay=2,he(u,a),a.intensity!==void 0&&(u.intensity=a.intensity),u.name=n.createUniqueName(a.name||"light_"+e),i=Promise.resolve(u),n.cache.add(r,i),i}getDependency(e,n){if(e==="light")return this._loadLight(n)}createNodeAttachment(e){let n=this,r=this.parser,s=r.json.nodes[e],l=(s.extensions&&s.extensions[this.name]||{}).light;return l===void 0?null:this._loadLight(l).then(function(a){return r._getNodeRef(n.cache,l,a)})}},Yt=class{constructor(){this.name=S.KHR_MATERIALS_UNLIT}getMaterialType(){return f.MeshBasicMaterial}extendParams(e,n,r){let i=[];e.color=new f.Color(1,1,1),e.opacity=1;let s=n.pbrMetallicRoughness;if(s){if(Array.isArray(s.baseColorFactor)){let o=s.baseColorFactor;e.color.setRGB(o[0],o[1],o[2],f.LinearSRGBColorSpace),e.opacity=o[3]}s.baseColorTexture!==void 0&&i.push(r.assignTexture(e,"map",s.baseColorTexture,f.SRGBColorSpace))}return Promise.all(i)}},Qt=class{constructor(e){this.parser=e,this.name=S.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,n){let i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let s=i.extensions[this.name].emissiveStrength;return s!==void 0&&(n.emissiveIntensity=s),Promise.resolve()}},Kt=class{constructor(e){this.parser=e,this.name=S.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){let r=this.parser.json.materials[e];return!r.extensions||!r.extensions[this.name]?null:f.MeshPhysicalMaterial}extendMaterialParams(e,n){let r=this.parser,i=r.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let s=[],o=i.extensions[this.name];if(o.clearcoatFactor!==void 0&&(n.clearcoat=o.clearcoatFactor),o.clearcoatTexture!==void 0&&s.push(r.assignTexture(n,"clearcoatMap",o.clearcoatTexture)),o.clearcoatRoughnessFactor!==void 0&&(n.clearcoatRoughness=o.clearcoatRoughnessFactor),o.clearcoatRoughnessTexture!==void 0&&s.push(r.assignTexture(n,"clearcoatRoughnessMap",o.clearcoatRoughnessTexture)),o.clearcoatNormalTexture!==void 0&&(s.push(r.assignTexture(n,"clearcoatNormalMap",o.clearcoatNormalTexture)),o.clearcoatNormalTexture.scale!==void 0)){let l=o.clearcoatNormalTexture.scale;n.clearcoatNormalScale=new f.Vector2(l,l)}return Promise.all(s)}},Zt=class{constructor(e){this.parser=e,this.name=S.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){let r=this.parser.json.materials[e];return!r.extensions||!r.extensions[this.name]?null:f.MeshPhysicalMaterial}extendMaterialParams(e,n){let r=this.parser,i=r.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let s=[],o=i.extensions[this.name];return o.iridescenceFactor!==void 0&&(n.iridescence=o.iridescenceFactor),o.iridescenceTexture!==void 0&&s.push(r.assignTexture(n,"iridescenceMap",o.iridescenceTexture)),o.iridescenceIor!==void 0&&(n.iridescenceIOR=o.iridescenceIor),n.iridescenceThicknessRange===void 0&&(n.iridescenceThicknessRange=[100,400]),o.iridescenceThicknessMinimum!==void 0&&(n.iridescenceThicknessRange[0]=o.iridescenceThicknessMinimum),o.iridescenceThicknessMaximum!==void 0&&(n.iridescenceThicknessRange[1]=o.iridescenceThicknessMaximum),o.iridescenceThicknessTexture!==void 0&&s.push(r.assignTexture(n,"iridescenceThicknessMap",o.iridescenceThicknessTexture)),Promise.all(s)}},$t=class{constructor(e){this.parser=e,this.name=S.KHR_MATERIALS_SHEEN}getMaterialType(e){let r=this.parser.json.materials[e];return!r.extensions||!r.extensions[this.name]?null:f.MeshPhysicalMaterial}extendMaterialParams(e,n){let r=this.parser,i=r.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let s=[];n.sheenColor=new f.Color(0,0,0),n.sheenRoughness=0,n.sheen=1;let o=i.extensions[this.name];if(o.sheenColorFactor!==void 0){let l=o.sheenColorFactor;n.sheenColor.setRGB(l[0],l[1],l[2],f.LinearSRGBColorSpace)}return o.sheenRoughnessFactor!==void 0&&(n.sheenRoughness=o.sheenRoughnessFactor),o.sheenColorTexture!==void 0&&s.push(r.assignTexture(n,"sheenColorMap",o.sheenColorTexture,f.SRGBColorSpace)),o.sheenRoughnessTexture!==void 0&&s.push(r.assignTexture(n,"sheenRoughnessMap",o.sheenRoughnessTexture)),Promise.all(s)}},Jt=class{constructor(e){this.parser=e,this.name=S.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){let r=this.parser.json.materials[e];return!r.extensions||!r.extensions[this.name]?null:f.MeshPhysicalMaterial}extendMaterialParams(e,n){let r=this.parser,i=r.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let s=[],o=i.extensions[this.name];return o.transmissionFactor!==void 0&&(n.transmission=o.transmissionFactor),o.transmissionTexture!==void 0&&s.push(r.assignTexture(n,"transmissionMap",o.transmissionTexture)),Promise.all(s)}},en=class{constructor(e){this.parser=e,this.name=S.KHR_MATERIALS_VOLUME}getMaterialType(e){let r=this.parser.json.materials[e];return!r.extensions||!r.extensions[this.name]?null:f.MeshPhysicalMaterial}extendMaterialParams(e,n){let r=this.parser,i=r.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let s=[],o=i.extensions[this.name];n.thickness=o.thicknessFactor!==void 0?o.thicknessFactor:0,o.thicknessTexture!==void 0&&s.push(r.assignTexture(n,"thicknessMap",o.thicknessTexture)),n.attenuationDistance=o.attenuationDistance||1/0;let l=o.attenuationColor||[1,1,1];return n.attenuationColor=new f.Color().setRGB(l[0],l[1],l[2],f.LinearSRGBColorSpace),Promise.all(s)}},tn=class{constructor(e){this.parser=e,this.name=S.KHR_MATERIALS_IOR}getMaterialType(e){let r=this.parser.json.materials[e];return!r.extensions||!r.extensions[this.name]?null:f.MeshPhysicalMaterial}extendMaterialParams(e,n){let i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let s=i.extensions[this.name];return n.ior=s.ior!==void 0?s.ior:1.5,Promise.resolve()}},nn=class{constructor(e){this.parser=e,this.name=S.KHR_MATERIALS_SPECULAR}getMaterialType(e){let r=this.parser.json.materials[e];return!r.extensions||!r.extensions[this.name]?null:f.MeshPhysicalMaterial}extendMaterialParams(e,n){let r=this.parser,i=r.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let s=[],o=i.extensions[this.name];n.specularIntensity=o.specularFactor!==void 0?o.specularFactor:1,o.specularTexture!==void 0&&s.push(r.assignTexture(n,"specularIntensityMap",o.specularTexture));let l=o.specularColorFactor||[1,1,1];return n.specularColor=new f.Color().setRGB(l[0],l[1],l[2],f.LinearSRGBColorSpace),o.specularColorTexture!==void 0&&s.push(r.assignTexture(n,"specularColorMap",o.specularColorTexture,f.SRGBColorSpace)),Promise.all(s)}},rn=class{constructor(e){this.parser=e,this.name=S.EXT_MATERIALS_BUMP}getMaterialType(e){let r=this.parser.json.materials[e];return!r.extensions||!r.extensions[this.name]?null:f.MeshPhysicalMaterial}extendMaterialParams(e,n){let r=this.parser,i=r.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let s=[],o=i.extensions[this.name];return n.bumpScale=o.bumpFactor!==void 0?o.bumpFactor:1,o.bumpTexture!==void 0&&s.push(r.assignTexture(n,"bumpMap",o.bumpTexture)),Promise.all(s)}},sn=class{constructor(e){this.parser=e,this.name=S.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){let r=this.parser.json.materials[e];return!r.extensions||!r.extensions[this.name]?null:f.MeshPhysicalMaterial}extendMaterialParams(e,n){let r=this.parser,i=r.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let s=[],o=i.extensions[this.name];return o.anisotropyStrength!==void 0&&(n.anisotropy=o.anisotropyStrength),o.anisotropyRotation!==void 0&&(n.anisotropyRotation=o.anisotropyRotation),o.anisotropyTexture!==void 0&&s.push(r.assignTexture(n,"anisotropyMap",o.anisotropyTexture)),Promise.all(s)}},on=class{constructor(e){this.parser=e,this.name=S.KHR_TEXTURE_BASISU}loadTexture(e){let n=this.parser,r=n.json,i=r.textures[e];if(!i.extensions||!i.extensions[this.name])return null;let s=i.extensions[this.name],o=n.options.ktx2Loader;if(!o){if(r.extensionsRequired&&r.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return n.loadTextureImage(e,s.source,o)}},an=class{constructor(e){this.parser=e,this.name=S.EXT_TEXTURE_WEBP,this.isSupported=null}loadTexture(e){let n=this.name,r=this.parser,i=r.json,s=i.textures[e];if(!s.extensions||!s.extensions[n])return null;let o=s.extensions[n],l=i.images[o.source],a=r.textureLoader;if(l.uri){let u=r.options.manager.getHandler(l.uri);u!==null&&(a=u)}return this.detectSupport().then(function(u){if(u)return r.loadTextureImage(e,o.source,a);if(i.extensionsRequired&&i.extensionsRequired.indexOf(n)>=0)throw new Error("THREE.GLTFLoader: WebP required by asset but unsupported.");return r.loadTexture(e)})}detectSupport(){return this.isSupported||(this.isSupported=new Promise(function(e){let n=new Image;n.src="data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",n.onload=n.onerror=function(){e(n.height===1)}})),this.isSupported}},ln=class{constructor(e){this.parser=e,this.name=S.EXT_TEXTURE_AVIF,this.isSupported=null}loadTexture(e){let n=this.name,r=this.parser,i=r.json,s=i.textures[e];if(!s.extensions||!s.extensions[n])return null;let o=s.extensions[n],l=i.images[o.source],a=r.textureLoader;if(l.uri){let u=r.options.manager.getHandler(l.uri);u!==null&&(a=u)}return this.detectSupport().then(function(u){if(u)return r.loadTextureImage(e,o.source,a);if(i.extensionsRequired&&i.extensionsRequired.indexOf(n)>=0)throw new Error("THREE.GLTFLoader: AVIF required by asset but unsupported.");return r.loadTexture(e)})}detectSupport(){return this.isSupported||(this.isSupported=new Promise(function(e){let n=new Image;n.src="data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=",n.onload=n.onerror=function(){e(n.height===1)}})),this.isSupported}},un=class{constructor(e){this.name=S.EXT_MESHOPT_COMPRESSION,this.parser=e}loadBufferView(e){let n=this.parser.json,r=n.bufferViews[e];if(r.extensions&&r.extensions[this.name]){let i=r.extensions[this.name],s=this.parser.getDependency("buffer",i.buffer),o=this.parser.options.meshoptDecoder;if(!o||!o.supported){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return s.then(function(l){let a=i.byteOffset||0,u=i.byteLength||0,d=i.count,c=i.byteStride,h=new Uint8Array(l,a,u);return o.decodeGltfBufferAsync?o.decodeGltfBufferAsync(d,c,h,i.mode,i.filter).then(function(p){return p.buffer}):o.ready.then(function(){let p=new ArrayBuffer(d*c);return o.decodeGltfBuffer(new Uint8Array(p),d,c,h,i.mode,i.filter),p})})}else return null}},cn=class{constructor(e){this.name=S.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let n=this.parser.json,r=n.nodes[e];if(!r.extensions||!r.extensions[this.name]||r.mesh===void 0)return null;let i=n.meshes[r.mesh];for(let u of i.primitives)if(u.mode!==z.TRIANGLES&&u.mode!==z.TRIANGLE_STRIP&&u.mode!==z.TRIANGLE_FAN&&u.mode!==void 0)return null;let o=r.extensions[this.name].attributes,l=[],a={};for(let u in o)l.push(this.parser.getDependency("accessor",o[u]).then(d=>(a[u]=d,a[u])));return l.length<1?null:(l.push(this.parser.createNodeMesh(e)),Promise.all(l).then(u=>{let d=u.pop(),c=d.isGroup?d.children:[d],h=u[0].count,p=[];for(let m of c){let g=new f.Matrix4,_=new f.Vector3,v=new f.Quaternion,T=new f.Vector3(1,1,1),x=new f.InstancedMesh(m.geometry,m.material,h);for(let E=0;E<h;E++)a.TRANSLATION&&_.fromBufferAttribute(a.TRANSLATION,E),a.ROTATION&&v.fromBufferAttribute(a.ROTATION,E),a.SCALE&&T.fromBufferAttribute(a.SCALE,E),x.setMatrixAt(E,g.compose(_,v,T));for(let E in a)if(E==="_COLOR_0"){let M=a[E];x.instanceColor=new f.InstancedBufferAttribute(M.array,M.itemSize,M.normalized)}else E!=="TRANSLATION"&&E!=="ROTATION"&&E!=="SCALE"&&m.geometry.setAttribute(E,a[E]);f.Object3D.prototype.copy.call(x,m),this.parser.assignFinalMaterial(x),p.push(x)}return d.isGroup?(d.clear(),d.add(...p),d):p[0]}))}},_i="glTF",je=12,fi={JSON:1313821514,BIN:5130562},dn=class{constructor(e){this.name=S.KHR_BINARY_GLTF,this.content=null,this.body=null;let n=new DataView(e,0,je),r=new TextDecoder;if(this.header={magic:r.decode(new Uint8Array(e.slice(0,4))),version:n.getUint32(4,!0),length:n.getUint32(8,!0)},this.header.magic!==_i)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");let i=this.header.length-je,s=new DataView(e,je),o=0;for(;o<i;){let l=s.getUint32(o,!0);o+=4;let a=s.getUint32(o,!0);if(o+=4,a===fi.JSON){let u=new Uint8Array(e,je+o,l);this.content=r.decode(u)}else if(a===fi.BIN){let u=je+o;this.body=e.slice(u,u+l)}o+=l}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}},hn=class{constructor(e,n){if(!n)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=S.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=n,this.dracoLoader.preload()}decodePrimitive(e,n){let r=this.json,i=this.dracoLoader,s=e.extensions[this.name].bufferView,o=e.extensions[this.name].attributes,l={},a={},u={};for(let d in o){let c=gn[d]||d.toLowerCase();l[c]=o[d]}for(let d in e.attributes){let c=gn[d]||d.toLowerCase();if(o[d]!==void 0){let h=r.accessors[e.attributes[d]],p=Ie[h.componentType];u[c]=p.name,a[c]=h.normalized===!0}}return n.getDependency("bufferView",s).then(function(d){return new Promise(function(c,h){i.decodeDracoFile(d,function(p){for(let m in p.attributes){let g=p.attributes[m],_=a[m];_!==void 0&&(g.normalized=_)}c(p)},l,u,f.LinearSRGBColorSpace,h)})})}},fn=class{constructor(){this.name=S.KHR_TEXTURE_TRANSFORM}extendTexture(e,n){return(n.texCoord===void 0||n.texCoord===e.channel)&&n.offset===void 0&&n.rotation===void 0&&n.scale===void 0||(e=e.clone(),n.texCoord!==void 0&&(e.channel=n.texCoord),n.offset!==void 0&&e.offset.fromArray(n.offset),n.rotation!==void 0&&(e.rotation=n.rotation),n.scale!==void 0&&e.repeat.fromArray(n.scale),e.needsUpdate=!0),e}},pn=class{constructor(){this.name=S.KHR_MESH_QUANTIZATION}},ft=class extends f.Interpolant{constructor(e,n,r,i){super(e,n,r,i)}copySampleValue_(e){let n=this.resultBuffer,r=this.sampleValues,i=this.valueSize,s=e*i*3+i;for(let o=0;o!==i;o++)n[o]=r[s+o];return n}interpolate_(e,n,r,i){let s=this.resultBuffer,o=this.sampleValues,l=this.valueSize,a=l*2,u=l*3,d=i-n,c=(r-n)/d,h=c*c,p=h*c,m=e*u,g=m-u,_=-2*p+3*h,v=p-h,T=1-_,x=v-h+c;for(let E=0;E!==l;E++){let M=o[g+E+l],y=o[g+E+a]*d,w=o[m+E+l],b=o[m+E]*d;s[E]=T*M+x*y+_*w+v*b}return s}},fa=new f.Quaternion,mn=class extends ft{interpolate_(e,n,r,i){let s=super.interpolate_(e,n,r,i);return fa.fromArray(s).normalize().toArray(s),s}},z={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},Ie={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},pi={9728:f.NearestFilter,9729:f.LinearFilter,9984:f.NearestMipmapNearestFilter,9985:f.LinearMipmapNearestFilter,9986:f.NearestMipmapLinearFilter,9987:f.LinearMipmapLinearFilter},mi={33071:f.ClampToEdgeWrapping,33648:f.MirroredRepeatWrapping,10497:f.RepeatWrapping},zt={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},gn={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},de={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},pa={CUBICSPLINE:void 0,LINEAR:f.InterpolateLinear,STEP:f.InterpolateDiscrete},jt={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function ma(t){return t.DefaultMaterial===void 0&&(t.DefaultMaterial=new f.MeshStandardMaterial({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:f.FrontSide})),t.DefaultMaterial}function Me(t,e,n){for(let r in n.extensions)t[r]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[r]=n.extensions[r])}function he(t,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(t.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function ga(t,e,n){let r=!1,i=!1,s=!1;for(let u=0,d=e.length;u<d;u++){let c=e[u];if(c.POSITION!==void 0&&(r=!0),c.NORMAL!==void 0&&(i=!0),c.COLOR_0!==void 0&&(s=!0),r&&i&&s)break}if(!r&&!i&&!s)return Promise.resolve(t);let o=[],l=[],a=[];for(let u=0,d=e.length;u<d;u++){let c=e[u];if(r){let h=c.POSITION!==void 0?n.getDependency("accessor",c.POSITION):t.attributes.position;o.push(h)}if(i){let h=c.NORMAL!==void 0?n.getDependency("accessor",c.NORMAL):t.attributes.normal;l.push(h)}if(s){let h=c.COLOR_0!==void 0?n.getDependency("accessor",c.COLOR_0):t.attributes.color;a.push(h)}}return Promise.all([Promise.all(o),Promise.all(l),Promise.all(a)]).then(function(u){let d=u[0],c=u[1],h=u[2];return r&&(t.morphAttributes.position=d),i&&(t.morphAttributes.normal=c),s&&(t.morphAttributes.color=h),t.morphTargetsRelative=!0,t})}function _a(t,e){if(t.updateMorphTargets(),e.weights!==void 0)for(let n=0,r=e.weights.length;n<r;n++)t.morphTargetInfluences[n]=e.weights[n];if(e.extras&&Array.isArray(e.extras.targetNames)){let n=e.extras.targetNames;if(t.morphTargetInfluences.length===n.length){t.morphTargetDictionary={};for(let r=0,i=n.length;r<i;r++)t.morphTargetDictionary[n[r]]=r}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function va(t){let e,n=t.extensions&&t.extensions[S.KHR_DRACO_MESH_COMPRESSION];if(n?e="draco:"+n.bufferView+":"+n.indices+":"+Xt(n.attributes):e=t.indices+":"+Xt(t.attributes)+":"+t.mode,t.targets!==void 0)for(let r=0,i=t.targets.length;r<i;r++)e+=":"+Xt(t.targets[r]);return e}function Xt(t){let e="",n=Object.keys(t).sort();for(let r=0,i=n.length;r<i;r++)e+=n[r]+":"+t[n[r]]+";";return e}function _n(t){switch(t){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function Ea(t){return t.search(/\.jpe?g($|\?)/i)>0||t.search(/^data\:image\/jpeg/)===0?"image/jpeg":t.search(/\.webp($|\?)/i)>0||t.search(/^data\:image\/webp/)===0?"image/webp":"image/png"}var Ta=new f.Matrix4,vn=class{constructor(e={},n={}){this.json=e,this.extensions={},this.plugins={},this.options=n,this.cache=new ha,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let r=!1,i=!1,s=-1;typeof navigator<"u"&&(r=/^((?!chrome|android).)*safari/i.test(navigator.userAgent)===!0,i=navigator.userAgent.indexOf("Firefox")>-1,s=i?navigator.userAgent.match(/Firefox\/([0-9]+)\./)[1]:-1),typeof createImageBitmap>"u"||r||i&&s<98?this.textureLoader=new f.TextureLoader(this.options.manager):this.textureLoader=new f.ImageBitmapLoader(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new f.FileLoader(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,n){let r=this,i=this.json,s=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(o){return o._markDefs&&o._markDefs()}),Promise.all(this._invokeAll(function(o){return o.beforeRoot&&o.beforeRoot()})).then(function(){return Promise.all([r.getDependencies("scene"),r.getDependencies("animation"),r.getDependencies("camera")])}).then(function(o){let l={scene:o[0][i.scene||0],scenes:o[0],animations:o[1],cameras:o[2],asset:i.asset,parser:r,userData:{}};return Me(s,l,i),he(l,i),Promise.all(r._invokeAll(function(a){return a.afterRoot&&a.afterRoot(l)})).then(function(){e(l)})}).catch(n)}_markDefs(){let e=this.json.nodes||[],n=this.json.skins||[],r=this.json.meshes||[];for(let i=0,s=n.length;i<s;i++){let o=n[i].joints;for(let l=0,a=o.length;l<a;l++)e[o[l]].isBone=!0}for(let i=0,s=e.length;i<s;i++){let o=e[i];o.mesh!==void 0&&(this._addNodeRef(this.meshCache,o.mesh),o.skin!==void 0&&(r[o.mesh].isSkinnedMesh=!0)),o.camera!==void 0&&this._addNodeRef(this.cameraCache,o.camera)}}_addNodeRef(e,n){n!==void 0&&(e.refs[n]===void 0&&(e.refs[n]=e.uses[n]=0),e.refs[n]++)}_getNodeRef(e,n,r){if(e.refs[n]<=1)return r;let i=r.clone(),s=(o,l)=>{let a=this.associations.get(o);a!=null&&this.associations.set(l,a);for(let[u,d]of o.children.entries())s(d,l.children[u])};return s(r,i),i.name+="_instance_"+e.uses[n]++,i}_invokeOne(e){let n=Object.values(this.plugins);n.push(this);for(let r=0;r<n.length;r++){let i=e(n[r]);if(i)return i}return null}_invokeAll(e){let n=Object.values(this.plugins);n.unshift(this);let r=[];for(let i=0;i<n.length;i++){let s=e(n[i]);s&&r.push(s)}return r}getDependency(e,n){let r=e+":"+n,i=this.cache.get(r);if(!i){switch(e){case"scene":i=this.loadScene(n);break;case"node":i=this._invokeOne(function(s){return s.loadNode&&s.loadNode(n)});break;case"mesh":i=this._invokeOne(function(s){return s.loadMesh&&s.loadMesh(n)});break;case"accessor":i=this.loadAccessor(n);break;case"bufferView":i=this._invokeOne(function(s){return s.loadBufferView&&s.loadBufferView(n)});break;case"buffer":i=this.loadBuffer(n);break;case"material":i=this._invokeOne(function(s){return s.loadMaterial&&s.loadMaterial(n)});break;case"texture":i=this._invokeOne(function(s){return s.loadTexture&&s.loadTexture(n)});break;case"skin":i=this.loadSkin(n);break;case"animation":i=this._invokeOne(function(s){return s.loadAnimation&&s.loadAnimation(n)});break;case"camera":i=this.loadCamera(n);break;default:if(i=this._invokeOne(function(s){return s!=this&&s.getDependency&&s.getDependency(e,n)}),!i)throw new Error("Unknown type: "+e);break}this.cache.add(r,i)}return i}getDependencies(e){let n=this.cache.get(e);if(!n){let r=this,i=this.json[e+(e==="mesh"?"es":"s")]||[];n=Promise.all(i.map(function(s,o){return r.getDependency(e,o)})),this.cache.add(e,n)}return n}loadBuffer(e){let n=this.json.buffers[e],r=this.fileLoader;if(n.type&&n.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+n.type+" buffer type is not supported.");if(n.uri===void 0&&e===0)return Promise.resolve(this.extensions[S.KHR_BINARY_GLTF].body);let i=this.options;return new Promise(function(s,o){r.load(f.LoaderUtils.resolveURL(n.uri,i.path),s,void 0,function(){o(new Error('THREE.GLTFLoader: Failed to load buffer "'+n.uri+'".'))})})}loadBufferView(e){let n=this.json.bufferViews[e];return this.getDependency("buffer",n.buffer).then(function(r){let i=n.byteLength||0,s=n.byteOffset||0;return r.slice(s,s+i)})}loadAccessor(e){let n=this,r=this.json,i=this.json.accessors[e];if(i.bufferView===void 0&&i.sparse===void 0){let o=zt[i.type],l=Ie[i.componentType],a=i.normalized===!0,u=new l(i.count*o);return Promise.resolve(new f.BufferAttribute(u,o,a))}let s=[];return i.bufferView!==void 0?s.push(this.getDependency("bufferView",i.bufferView)):s.push(null),i.sparse!==void 0&&(s.push(this.getDependency("bufferView",i.sparse.indices.bufferView)),s.push(this.getDependency("bufferView",i.sparse.values.bufferView))),Promise.all(s).then(function(o){let l=o[0],a=zt[i.type],u=Ie[i.componentType],d=u.BYTES_PER_ELEMENT,c=d*a,h=i.byteOffset||0,p=i.bufferView!==void 0?r.bufferViews[i.bufferView].byteStride:void 0,m=i.normalized===!0,g,_;if(p&&p!==c){let v=Math.floor(h/p),T="InterleavedBuffer:"+i.bufferView+":"+i.componentType+":"+v+":"+i.count,x=n.cache.get(T);x||(g=new u(l,v*p,i.count*p/d),x=new f.InterleavedBuffer(g,p/d),n.cache.add(T,x)),_=new f.InterleavedBufferAttribute(x,a,h%p/d,m)}else l===null?g=new u(i.count*a):g=new u(l,h,i.count*a),_=new f.BufferAttribute(g,a,m);if(i.sparse!==void 0){let v=zt.SCALAR,T=Ie[i.sparse.indices.componentType],x=i.sparse.indices.byteOffset||0,E=i.sparse.values.byteOffset||0,M=new T(o[1],x,i.sparse.count*v),y=new u(o[2],E,i.sparse.count*a);l!==null&&(_=new f.BufferAttribute(_.array.slice(),_.itemSize,_.normalized));for(let w=0,b=M.length;w<b;w++){let H=M[w];if(_.setX(H,y[w*a]),a>=2&&_.setY(H,y[w*a+1]),a>=3&&_.setZ(H,y[w*a+2]),a>=4&&_.setW(H,y[w*a+3]),a>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}}return _})}loadTexture(e){let n=this.json,r=this.options,s=n.textures[e].source,o=n.images[s],l=this.textureLoader;if(o.uri){let a=r.manager.getHandler(o.uri);a!==null&&(l=a)}return this.loadTextureImage(e,s,l)}loadTextureImage(e,n,r){let i=this,s=this.json,o=s.textures[e],l=s.images[n],a=(l.uri||l.bufferView)+":"+o.sampler;if(this.textureCache[a])return this.textureCache[a];let u=this.loadImageSource(n,r).then(function(d){d.flipY=!1,d.name=o.name||l.name||"",d.name===""&&typeof l.uri=="string"&&l.uri.startsWith("data:image/")===!1&&(d.name=l.uri);let h=(s.samplers||{})[o.sampler]||{};return d.magFilter=pi[h.magFilter]||f.LinearFilter,d.minFilter=pi[h.minFilter]||f.LinearMipmapLinearFilter,d.wrapS=mi[h.wrapS]||f.RepeatWrapping,d.wrapT=mi[h.wrapT]||f.RepeatWrapping,i.associations.set(d,{textures:e}),d}).catch(function(){return null});return this.textureCache[a]=u,u}loadImageSource(e,n){let r=this,i=this.json,s=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(c=>c.clone());let o=i.images[e],l=self.URL||self.webkitURL,a=o.uri||"",u=!1;if(o.bufferView!==void 0)a=r.getDependency("bufferView",o.bufferView).then(function(c){u=!0;let h=new Blob([c],{type:o.mimeType});return a=l.createObjectURL(h),a});else if(o.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");let d=Promise.resolve(a).then(function(c){return new Promise(function(h,p){let m=h;n.isImageBitmapLoader===!0&&(m=function(g){let _=new f.Texture(g);_.needsUpdate=!0,h(_)}),n.load(f.LoaderUtils.resolveURL(c,s.path),m,void 0,p)})}).then(function(c){return u===!0&&l.revokeObjectURL(a),c.userData.mimeType=o.mimeType||Ea(o.uri),c}).catch(function(c){throw console.error("THREE.GLTFLoader: Couldn't load texture",a),c});return this.sourceCache[e]=d,d}assignTexture(e,n,r,i){let s=this;return this.getDependency("texture",r.index).then(function(o){if(!o)return null;if(r.texCoord!==void 0&&r.texCoord>0&&(o=o.clone(),o.channel=r.texCoord),s.extensions[S.KHR_TEXTURE_TRANSFORM]){let l=r.extensions!==void 0?r.extensions[S.KHR_TEXTURE_TRANSFORM]:void 0;if(l){let a=s.associations.get(o);o=s.extensions[S.KHR_TEXTURE_TRANSFORM].extendTexture(o,l),s.associations.set(o,a)}}return i!==void 0&&(o.colorSpace=i),e[n]=o,o})}assignFinalMaterial(e){let n=e.geometry,r=e.material,i=n.attributes.tangent===void 0,s=n.attributes.color!==void 0,o=n.attributes.normal===void 0;if(e.isPoints){let l="PointsMaterial:"+r.uuid,a=this.cache.get(l);a||(a=new f.PointsMaterial,f.Material.prototype.copy.call(a,r),a.color.copy(r.color),a.map=r.map,a.sizeAttenuation=!1,this.cache.add(l,a)),r=a}else if(e.isLine){let l="LineBasicMaterial:"+r.uuid,a=this.cache.get(l);a||(a=new f.LineBasicMaterial,f.Material.prototype.copy.call(a,r),a.color.copy(r.color),a.map=r.map,this.cache.add(l,a)),r=a}if(i||s||o){let l="ClonedMaterial:"+r.uuid+":";i&&(l+="derivative-tangents:"),s&&(l+="vertex-colors:"),o&&(l+="flat-shading:");let a=this.cache.get(l);a||(a=r.clone(),s&&(a.vertexColors=!0),o&&(a.flatShading=!0),i&&(a.normalScale&&(a.normalScale.y*=-1),a.clearcoatNormalScale&&(a.clearcoatNormalScale.y*=-1)),this.cache.add(l,a),this.associations.set(a,this.associations.get(r))),r=a}e.material=r}getMaterialType(){return f.MeshStandardMaterial}loadMaterial(e){let n=this,r=this.json,i=this.extensions,s=r.materials[e],o,l={},a=s.extensions||{},u=[];if(a[S.KHR_MATERIALS_UNLIT]){let c=i[S.KHR_MATERIALS_UNLIT];o=c.getMaterialType(),u.push(c.extendParams(l,s,n))}else{let c=s.pbrMetallicRoughness||{};if(l.color=new f.Color(1,1,1),l.opacity=1,Array.isArray(c.baseColorFactor)){let h=c.baseColorFactor;l.color.setRGB(h[0],h[1],h[2],f.LinearSRGBColorSpace),l.opacity=h[3]}c.baseColorTexture!==void 0&&u.push(n.assignTexture(l,"map",c.baseColorTexture,f.SRGBColorSpace)),l.metalness=c.metallicFactor!==void 0?c.metallicFactor:1,l.roughness=c.roughnessFactor!==void 0?c.roughnessFactor:1,c.metallicRoughnessTexture!==void 0&&(u.push(n.assignTexture(l,"metalnessMap",c.metallicRoughnessTexture)),u.push(n.assignTexture(l,"roughnessMap",c.metallicRoughnessTexture))),o=this._invokeOne(function(h){return h.getMaterialType&&h.getMaterialType(e)}),u.push(Promise.all(this._invokeAll(function(h){return h.extendMaterialParams&&h.extendMaterialParams(e,l)})))}s.doubleSided===!0&&(l.side=f.DoubleSide);let d=s.alphaMode||jt.OPAQUE;if(d===jt.BLEND?(l.transparent=!0,l.depthWrite=!1):(l.transparent=!1,d===jt.MASK&&(l.alphaTest=s.alphaCutoff!==void 0?s.alphaCutoff:.5)),s.normalTexture!==void 0&&o!==f.MeshBasicMaterial&&(u.push(n.assignTexture(l,"normalMap",s.normalTexture)),l.normalScale=new f.Vector2(1,1),s.normalTexture.scale!==void 0)){let c=s.normalTexture.scale;l.normalScale.set(c,c)}if(s.occlusionTexture!==void 0&&o!==f.MeshBasicMaterial&&(u.push(n.assignTexture(l,"aoMap",s.occlusionTexture)),s.occlusionTexture.strength!==void 0&&(l.aoMapIntensity=s.occlusionTexture.strength)),s.emissiveFactor!==void 0&&o!==f.MeshBasicMaterial){let c=s.emissiveFactor;l.emissive=new f.Color().setRGB(c[0],c[1],c[2],f.LinearSRGBColorSpace)}return s.emissiveTexture!==void 0&&o!==f.MeshBasicMaterial&&u.push(n.assignTexture(l,"emissiveMap",s.emissiveTexture,f.SRGBColorSpace)),Promise.all(u).then(function(){let c=new o(l);return s.name&&(c.name=s.name),he(c,s),n.associations.set(c,{materials:e}),s.extensions&&Me(i,c,s),c})}createUniqueName(e){let n=f.PropertyBinding.sanitizeNodeName(e||"");return n in this.nodeNamesUsed?n+"_"+ ++this.nodeNamesUsed[n]:(this.nodeNamesUsed[n]=0,n)}loadGeometries(e){let n=this,r=this.extensions,i=this.primitiveCache;function s(l){return r[S.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(l,n).then(function(a){return gi(a,l,n)})}let o=[];for(let l=0,a=e.length;l<a;l++){let u=e[l],d=va(u),c=i[d];if(c)o.push(c.promise);else{let h;u.extensions&&u.extensions[S.KHR_DRACO_MESH_COMPRESSION]?h=s(u):h=gi(new f.BufferGeometry,u,n),i[d]={primitive:u,promise:h},o.push(h)}}return Promise.all(o)}loadMesh(e){let n=this,r=this.json,i=this.extensions,s=r.meshes[e],o=s.primitives,l=[];for(let a=0,u=o.length;a<u;a++){let d=o[a].material===void 0?ma(this.cache):this.getDependency("material",o[a].material);l.push(d)}return l.push(n.loadGeometries(o)),Promise.all(l).then(function(a){let u=a.slice(0,a.length-1),d=a[a.length-1],c=[];for(let p=0,m=d.length;p<m;p++){let g=d[p],_=o[p],v,T=u[p];if(_.mode===z.TRIANGLES||_.mode===z.TRIANGLE_STRIP||_.mode===z.TRIANGLE_FAN||_.mode===void 0)v=s.isSkinnedMesh===!0?new f.SkinnedMesh(g,T):new f.Mesh(g,T),v.isSkinnedMesh===!0&&v.normalizeSkinWeights(),_.mode===z.TRIANGLE_STRIP?v.geometry=Gt(v.geometry,f.TriangleStripDrawMode):_.mode===z.TRIANGLE_FAN&&(v.geometry=Gt(v.geometry,f.TriangleFanDrawMode));else if(_.mode===z.LINES)v=new f.LineSegments(g,T);else if(_.mode===z.LINE_STRIP)v=new f.Line(g,T);else if(_.mode===z.LINE_LOOP)v=new f.LineLoop(g,T);else if(_.mode===z.POINTS)v=new f.Points(g,T);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+_.mode);Object.keys(v.geometry.morphAttributes).length>0&&_a(v,s),v.name=n.createUniqueName(s.name||"mesh_"+e),he(v,s),_.extensions&&Me(i,v,_),n.assignFinalMaterial(v),c.push(v)}for(let p=0,m=c.length;p<m;p++)n.associations.set(c[p],{meshes:e,primitives:p});if(c.length===1)return s.extensions&&Me(i,c[0],s),c[0];let h=new f.Group;s.extensions&&Me(i,h,s),n.associations.set(h,{meshes:e});for(let p=0,m=c.length;p<m;p++)h.add(c[p]);return h})}loadCamera(e){let n,r=this.json.cameras[e],i=r[r.type];if(!i){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return r.type==="perspective"?n=new f.PerspectiveCamera(f.MathUtils.radToDeg(i.yfov),i.aspectRatio||1,i.znear||1,i.zfar||2e6):r.type==="orthographic"&&(n=new f.OrthographicCamera(-i.xmag,i.xmag,i.ymag,-i.ymag,i.znear,i.zfar)),r.name&&(n.name=this.createUniqueName(r.name)),he(n,r),Promise.resolve(n)}loadSkin(e){let n=this.json.skins[e],r=[];for(let i=0,s=n.joints.length;i<s;i++)r.push(this._loadNodeShallow(n.joints[i]));return n.inverseBindMatrices!==void 0?r.push(this.getDependency("accessor",n.inverseBindMatrices)):r.push(null),Promise.all(r).then(function(i){let s=i.pop(),o=i,l=[],a=[];for(let u=0,d=o.length;u<d;u++){let c=o[u];if(c){l.push(c);let h=new f.Matrix4;s!==null&&h.fromArray(s.array,u*16),a.push(h)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',n.joints[u])}return new f.Skeleton(l,a)})}loadAnimation(e){let n=this.json,r=this,i=n.animations[e],s=i.name?i.name:"animation_"+e,o=[],l=[],a=[],u=[],d=[];for(let c=0,h=i.channels.length;c<h;c++){let p=i.channels[c],m=i.samplers[p.sampler],g=p.target,_=g.node,v=i.parameters!==void 0?i.parameters[m.input]:m.input,T=i.parameters!==void 0?i.parameters[m.output]:m.output;g.node!==void 0&&(o.push(this.getDependency("node",_)),l.push(this.getDependency("accessor",v)),a.push(this.getDependency("accessor",T)),u.push(m),d.push(g))}return Promise.all([Promise.all(o),Promise.all(l),Promise.all(a),Promise.all(u),Promise.all(d)]).then(function(c){let h=c[0],p=c[1],m=c[2],g=c[3],_=c[4],v=[];for(let T=0,x=h.length;T<x;T++){let E=h[T],M=p[T],y=m[T],w=g[T],b=_[T];if(E===void 0)continue;E.updateMatrix&&E.updateMatrix();let H=r._createAnimationTracks(E,M,y,w,b);if(H)for(let I=0;I<H.length;I++)v.push(H[I])}return new f.AnimationClip(s,void 0,v)})}createNodeMesh(e){let n=this.json,r=this,i=n.nodes[e];return i.mesh===void 0?null:r.getDependency("mesh",i.mesh).then(function(s){let o=r._getNodeRef(r.meshCache,i.mesh,s);return i.weights!==void 0&&o.traverse(function(l){if(l.isMesh)for(let a=0,u=i.weights.length;a<u;a++)l.morphTargetInfluences[a]=i.weights[a]}),o})}loadNode(e){let n=this.json,r=this,i=n.nodes[e],s=r._loadNodeShallow(e),o=[],l=i.children||[];for(let u=0,d=l.length;u<d;u++)o.push(r.getDependency("node",l[u]));let a=i.skin===void 0?Promise.resolve(null):r.getDependency("skin",i.skin);return Promise.all([s,Promise.all(o),a]).then(function(u){let d=u[0],c=u[1],h=u[2];h!==null&&d.traverse(function(p){p.isSkinnedMesh&&p.bind(h,Ta)});for(let p=0,m=c.length;p<m;p++)d.add(c[p]);return d})}_loadNodeShallow(e){let n=this.json,r=this.extensions,i=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let s=n.nodes[e],o=s.name?i.createUniqueName(s.name):"",l=[],a=i._invokeOne(function(u){return u.createNodeMesh&&u.createNodeMesh(e)});return a&&l.push(a),s.camera!==void 0&&l.push(i.getDependency("camera",s.camera).then(function(u){return i._getNodeRef(i.cameraCache,s.camera,u)})),i._invokeAll(function(u){return u.createNodeAttachment&&u.createNodeAttachment(e)}).forEach(function(u){l.push(u)}),this.nodeCache[e]=Promise.all(l).then(function(u){let d;if(s.isBone===!0?d=new f.Bone:u.length>1?d=new f.Group:u.length===1?d=u[0]:d=new f.Object3D,d!==u[0])for(let c=0,h=u.length;c<h;c++)d.add(u[c]);if(s.name&&(d.userData.name=s.name,d.name=o),he(d,s),s.extensions&&Me(r,d,s),s.matrix!==void 0){let c=new f.Matrix4;c.fromArray(s.matrix),d.applyMatrix4(c)}else s.translation!==void 0&&d.position.fromArray(s.translation),s.rotation!==void 0&&d.quaternion.fromArray(s.rotation),s.scale!==void 0&&d.scale.fromArray(s.scale);return i.associations.has(d)||i.associations.set(d,{}),i.associations.get(d).nodes=e,d}),this.nodeCache[e]}loadScene(e){let n=this.extensions,r=this.json.scenes[e],i=this,s=new f.Group;r.name&&(s.name=i.createUniqueName(r.name)),he(s,r),r.extensions&&Me(n,s,r);let o=r.nodes||[],l=[];for(let a=0,u=o.length;a<u;a++)l.push(i.getDependency("node",o[a]));return Promise.all(l).then(function(a){for(let d=0,c=a.length;d<c;d++)s.add(a[d]);let u=d=>{let c=new Map;for(let[h,p]of i.associations)(h instanceof f.Material||h instanceof f.Texture)&&c.set(h,p);return d.traverse(h=>{let p=i.associations.get(h);p!=null&&c.set(h,p)}),c};return i.associations=u(s),s})}_createAnimationTracks(e,n,r,i,s){let o=[],l=e.name?e.name:e.uuid,a=[];de[s.path]===de.weights?e.traverse(function(h){h.morphTargetInfluences&&a.push(h.name?h.name:h.uuid)}):a.push(l);let u;switch(de[s.path]){case de.weights:u=f.NumberKeyframeTrack;break;case de.rotation:u=f.QuaternionKeyframeTrack;break;case de.position:case de.scale:u=f.VectorKeyframeTrack;break;default:switch(r.itemSize){case 1:u=f.NumberKeyframeTrack;break;case 2:case 3:default:u=f.VectorKeyframeTrack;break}break}let d=i.interpolation!==void 0?pa[i.interpolation]:f.InterpolateLinear,c=this._getArrayFromAccessor(r);for(let h=0,p=a.length;h<p;h++){let m=new u(a[h]+"."+de[s.path],n.array,c,d);i.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(m),o.push(m)}return o}_getArrayFromAccessor(e){let n=e.array;if(e.normalized){let r=_n(n.constructor),i=new Float32Array(n.length);for(let s=0,o=n.length;s<o;s++)i[s]=n[s]*r;n=i}return n}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(r){let i=this instanceof f.QuaternionKeyframeTrack?mn:ft;return new i(this.times,this.values,this.getValueSize()/3,r)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}};function Ma(t,e,n){let r=e.attributes,i=new f.Box3;if(r.POSITION!==void 0){let l=n.json.accessors[r.POSITION],a=l.min,u=l.max;if(a!==void 0&&u!==void 0){if(i.set(new f.Vector3(a[0],a[1],a[2]),new f.Vector3(u[0],u[1],u[2])),l.normalized){let d=_n(Ie[l.componentType]);i.min.multiplyScalar(d),i.max.multiplyScalar(d)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let s=e.targets;if(s!==void 0){let l=new f.Vector3,a=new f.Vector3;for(let u=0,d=s.length;u<d;u++){let c=s[u];if(c.POSITION!==void 0){let h=n.json.accessors[c.POSITION],p=h.min,m=h.max;if(p!==void 0&&m!==void 0){if(a.setX(Math.max(Math.abs(p[0]),Math.abs(m[0]))),a.setY(Math.max(Math.abs(p[1]),Math.abs(m[1]))),a.setZ(Math.max(Math.abs(p[2]),Math.abs(m[2]))),h.normalized){let g=_n(Ie[h.componentType]);a.multiplyScalar(g)}l.max(a)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}i.expandByVector(l)}t.boundingBox=i;let o=new f.Sphere;i.getCenter(o.center),o.radius=i.min.distanceTo(i.max)/2,t.boundingSphere=o}function gi(t,e,n){let r=e.attributes,i=[];function s(o,l){return n.getDependency("accessor",o).then(function(a){t.setAttribute(l,a)})}for(let o in r){let l=gn[o]||o.toLowerCase();l in t.attributes||i.push(s(r[o],l))}if(e.indices!==void 0&&!t.index){let o=n.getDependency("accessor",e.indices).then(function(l){t.setIndex(l)});i.push(o)}return f.ColorManagement.workingColorSpace!==f.LinearSRGBColorSpace&&"COLOR_0"in r&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${f.ColorManagement.workingColorSpace}" not supported.`),he(t,e),Ma(t,e,n),Promise.all(i).then(function(){return e.targets!==void 0?ga(t,e.targets,n):t})}var fe=A(R(),1);function vi(t){let e=new Map,n=new Map,r=t.clone();return Ei(t,r,function(i,s){e.set(s,i),n.set(i,s)}),r.traverse(function(i){if(!i.isSkinnedMesh)return;let s=i,o=e.get(i),l=o.skeleton.bones;s.skeleton=o.skeleton.clone(),s.bindMatrix.copy(o.bindMatrix),s.skeleton.bones=l.map(function(a){return n.get(a)}),s.bind(s.skeleton,s.bindMatrix)}),r}function Ei(t,e,n){n(t,e);for(let r=0;r<t.children.length;r++)Ei(t.children[r],e.children[r],n)}window.VRMLib={VRMLoaderPlugin:li,VRMUtils:ce,VRMHumanoid:nt,VRMExpressionMorphTargetBind:be,VRMSpringBoneManager:it,VRMSpringBoneJoint:Wt,VRMSpringBoneCollider:ke,MToonMaterial:Vt,GLTFLoader:ht,cloneSkinned:vi};})();
