// three-vrm + GLTFLoader, oyunun global THREE'sini kullanacak şekilde paketlenir (window.VRMLib)
import { VRMLoaderPlugin, VRMUtils, VRMHumanoid, VRMExpressionMorphTargetBind, VRMSpringBoneManager, VRMSpringBoneJoint, VRMSpringBoneCollider, MToonMaterial } from '@pixiv/three-vrm';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';
window.VRMLib = { VRMLoaderPlugin, VRMUtils, VRMHumanoid, VRMExpressionMorphTargetBind, VRMSpringBoneManager, VRMSpringBoneJoint, VRMSpringBoneCollider, MToonMaterial, GLTFLoader, cloneSkinned };
