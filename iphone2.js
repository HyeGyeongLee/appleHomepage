import * as THREE from "https://unpkg.com/three@0.108.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.108.0/examples/jsm/loaders/GLTFLoader.js";

let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

let scene, camera, renderer;
let model; // 로드된 모델 저장
let mixers = [];
let ambientLight, sunLight, fillLight; // 조명 변수들을 전역으로 선언

const init = () => {
    scene = new THREE.Scene();
    scene.background = new THREE.Color("#000000");
    
    camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 2000);
    camera.position.set(0, 0, 500);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    renderer.physicallyCorrectLights = false;
    renderer.outputEncoding = THREE.LinearEncoding;
    renderer.toneMapping = THREE.NoToneMapping;

    document.querySelector("#canvasWrap").appendChild(renderer.domElement);

    initLights();
    gltfLoadFunc('./model/iphone_16_plus.glb');
};

const gltfLoadFunc = (modelName) => {
    const loader = new GLTFLoader();
    
    loader.load(
        modelName,
        (gltf) => {
            // 원본 모델 처리
            model = gltf.scene;
            
            model.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    
                    if (child.material && child.material.isMeshStandardMaterial) {
                        child.material.opacity = 0.1;
                    }
                }
            });

            let scaleNum = 30;
            model.scale.set(scaleNum, scaleNum, scaleNum);
            model.position.set(0, 0, 0);
            model.rotation.y = 10;
            scene.add(model);

            // 새로운 핑크 색상 모델 추가
            window.pinkModel = gltf.scene.clone(); // 전역 변수로 저장
            
            window.pinkModel.traverse((child) => {
                if (child.isMesh && child.material && child.material.isMeshStandardMaterial) {
                    // 새로운 재질 생성 및 색상 변경
                    const pinkMaterial = child.material.clone();
                    pinkMaterial.color.setHex(0xFC5AD3);
                    pinkMaterial.opacity = 0; // 초기에 완전 투명
                    pinkMaterial.transparent = true;
                    child.material = pinkMaterial;
                }
            });

            // 핑크 모델 위치 설정
            window.pinkModel.scale.set(scaleNum, scaleNum, scaleNum);
            window.pinkModel.position.set(-100, 0, 0); // x축으로 이동
            window.pinkModel.rotation.y = 5.9;
            scene.add(window.pinkModel);

            //블루 클론
            window.blueModel = gltf.scene.clone(); // 전역 변수로 저장 #659AFF

            window.blueModel.traverse((child) => {
                if (child.isMesh && child.material && child.material.isMeshStandardMaterial) {
                    // 새로운 재질 생성 및 색상 변경
                    const blueMaterial = child.material.clone();
                    blueMaterial.color.setHex(0x659AFF);
                    blueMaterial.opacity = 0; // 초기에 완전 투명
                    blueMaterial.transparent = true;
                    child.material = blueMaterial;
                }
            });

            // 블루 모델 위치 설정
            window.blueModel.scale.set(scaleNum, scaleNum, scaleNum);
            window.blueModel.position.set(-200, 0, 0); // x축으로 이동
            window.blueModel.rotation.y = 5.9;
            scene.add(window.blueModel);

            //화이트 클론
            window.whiteModel = gltf.scene.clone(); // 전역 변수로 저장 #659AFF

            window.whiteModel.traverse((child) => {
                if (child.isMesh && child.material && child.material.isMeshStandardMaterial) {
                    // 새로운 재질 생성 및 색상 변경
                    const whiteMaterial = child.material.clone();
                    whiteMaterial.color.setHex(0xFCFCFC);
                    whiteMaterial.opacity = 0; // 초기에 완전 투명
                    whiteMaterial.transparent = true;
                    child.material = whiteMaterial;
                }
            });

            // 화이트 모델 위치 설정
            window.whiteModel.scale.set(scaleNum, scaleNum, scaleNum);
            window.whiteModel.position.set(-300, 0, 0); // x축으로 이동
            window.whiteModel.rotation.y = 5.9;
            scene.add(window.whiteModel);


            //블랙 클론
            window.blackModel = gltf.scene.clone(); // 전역 변수로 저장 #659AFF

            window.blackModel.traverse((child) => {
                if (child.isMesh && child.material && child.material.isMeshStandardMaterial) {
                    const blackMaterial = child.material.clone();
                    blackMaterial.color.setHex(0x1A1A1A); // 완전한 블랙 대신 아주 진한 회색 사용
                    blackMaterial.opacity = 0; // 초기에 완전 투명
                    blackMaterial.transparent = true;
                    blackMaterial.metalness = 0.5; // 금속성 추가 (0~1 사이 값)
                    blackMaterial.roughness = 0.5; // 거칠기 조정 (0~1 사이 값)
                    child.material = blackMaterial;
                }
            });
   
            // 블랙 모델 위치 설정
            window.blackModel.scale.set(scaleNum, scaleNum, scaleNum);
            window.blackModel.position.set(-400, 0, 0); // x축으로 이동
            window.blackModel.rotation.y = 5.9;
            scene.add(window.blackModel);
   
               
            

            // 애니메이션 처리
            // if (gltf.animations && gltf.animations.length) {
            //     const mixer = new THREE.AnimationMixer(model);
            //     const action = mixer.clipAction(gltf.animations[0]);
            //     action.play();
            //     mixers.push(mixer);

            //     // 핑크 모델도 같은 애니메이션 적용
            //     const pinkMixer = new THREE.AnimationMixer(window.pinkModel);
            //     const pinkAction = pinkMixer.clipAction(gltf.animations[0]);
            //     pinkAction.play();
            //     mixers.push(pinkMixer);
            // }
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        (error) => {
            console.error('An error happened:', error);
        }
    );
};

const initLights = () => {
    // 기존 조명 제거
    scene.children.forEach(child => {
        if (child.isLight) scene.remove(child);
    });

    // 초기 조명 설정 (매우 어둡게)
    ambientLight = new THREE.AmbientLight(0xffffff, 0.1); // 아주 약한 조명
    scene.add(ambientLight);

    sunLight = new THREE.DirectionalLight(0xffffff, 0.1); // 매우 어두운 조명
    sunLight.position.set(0, -5, 10);
    sunLight.castShadow = true;
    
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 500;
    sunLight.shadow.normalBias = 0.02;
    
    scene.add(sunLight);

    fillLight = new THREE.HemisphereLight(
        0xffffff, 
        0xffffff, 
        0.1 // 매우 낮은 강도
    );
    scene.add(fillLight);
};

const clock = new THREE.Clock();

const animate = () => {
    const delta = clock.getDelta();

    for (let i = 0; i < mixers.length; i++) {
        mixers[i].update(delta * 0.8);
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
};

const stageResize = () => {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    camera.updateProjectionMatrix();
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
};

init();
animate();
window.addEventListener("resize", stageResize);

let scrollTop = 0;
const sections = document.querySelectorAll('section');

const scrollFunc = () => {
    scrollTop = window.scrollY;

    // 첫 번째 섹션의 높이
    const firstSectionHeight = sections[0].offsetHeight;
    
    // 다섯가지 컬러 섹션
    const colorSection = sections[3];
    const colorSectionTop = colorSection.offsetTop;
    const colorSectionBottom = colorSectionTop + colorSection.offsetHeight;

    // 스크롤 진행 정도 계산 (0에서 1 사이)
    const scrollProgress = Math.min(scrollTop / firstSectionHeight, 1);
    
    // 모델 투명도 조절 (새로운 시대의 시작 섹션에서)
    if (model) {
        model.traverse((child) => {
            if (child.isMesh && child.material && child.material.isMeshStandardMaterial) {
                // 스크롤에 따라 0.1에서 1로 점진적 증가
                child.material.opacity = 0.01 + (scrollProgress * 0.9);
            }
        });

           // 핑크 모델 (존재하는 경우)
           if (window.pinkModel || window.blueModel || window.whiteModel || window.blackModel) {
            window.pinkModel.traverse((child) => {
                if (child.isMesh && child.material && child.material.isMeshStandardMaterial) {
                    // 다섯가지 컬러 섹션에서만 보이게 처리
                    if (scrollTop >= colorSectionTop && scrollTop <= colorSectionBottom) {
                        child.material.opacity = 1; // 완전 불투명
                    } else {
                        child.material.opacity = 0; // 완전 투명
                    }
                }
            });

            window.blueModel.traverse((child) => {
                if (child.isMesh && child.material && child.material.isMeshStandardMaterial) {
                    // 다섯가지 컬러 섹션에서만 보이게 처리
                    if (scrollTop >= colorSectionTop && scrollTop <= colorSectionBottom) {
                        child.material.opacity = 1; // 완전 불투명
                    } else {
                        child.material.opacity = 0; // 완전 투명
                    }
                }
            });

            window.whiteModel.traverse((child) => {
                if (child.isMesh && child.material && child.material.isMeshStandardMaterial) {
                    // 다섯가지 컬러 섹션에서만 보이게 처리
                    if (scrollTop >= colorSectionTop && scrollTop <= colorSectionBottom) {
                        child.material.opacity = 1; // 완전 불투명
                    } else {
                        child.material.opacity = 0; // 완전 투명
                    }
                }
            });

            window.blackModel.traverse((child) => {
                if (child.isMesh && child.material && child.material.isMeshStandardMaterial) {
                    // 다섯가지 컬러 섹션에서만 보이게 처리
                    if (scrollTop >= colorSectionTop && scrollTop <= colorSectionBottom) {
                        child.material.opacity = 1; // 완전 불투명
                    } else {
                        child.material.opacity = 0; // 완전 투명
                    }
                }
            });
        }


        // 다섯가지 컬러 섹션 이전까지만 회전 및 포지셔닝
        if (scrollTop < colorSectionTop) {
            model.rotation.y = scrollTop / 200;
            model.position.z = scrollTop / 200;
        } else {
            // 컬러 섹션부터는 회전 고정
            model.rotation.y = 9.9;
            model.position.z = 0;
        }
    }

    // 조명 강도 점진적으로 높이기
    if (ambientLight) {
        ambientLight.intensity = 0.1 + (scrollProgress * 3.9); // 0.1에서 4.0으로 증가
    }
    
    if (sunLight) {
        sunLight.intensity = 0.1 + (scrollProgress * 2.9); // 0.1에서 3.0으로 증가
    }
    
    if (fillLight) {
        fillLight.intensity = 0.1 + (scrollProgress * 1.4); // 0.1에서 1.5으로 증가
    }

    // iPhone 섹션 도달 시 특별 처리
    const iphoneSection = sections[1];
    const iphoneSectionTop = iphoneSection.offsetTop;
    const iphoneSectionBottom = iphoneSectionTop + iphoneSection.offsetHeight;

    if (scrollTop >= iphoneSectionTop && scrollTop <= iphoneSectionBottom) {
        // iPhone 섹션에서 모델을 완전히 선명하게
        if (model) {
            model.traverse((child) => {
                if (child.isMesh && child.material && child.material.isMeshStandardMaterial) {
                    child.material.opacity = 1; // 완전 불투명
                }
            });

            // 모델 위치 고정
            model.position.z = 0;
            model.rotation.y = 0;
        }

        // 조명을 최대 밝기로
        if (ambientLight) ambientLight.intensity = 4.0;
        if (sunLight) sunLight.intensity = 3.0;
        if (fillLight) fillLight.intensity = 1.5;
    }
};

window.addEventListener("scroll", scrollFunc);