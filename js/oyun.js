// 'window.onload' sarmalayıcısı, tüm kütüphanelerin yüklenmesini bekler.
window.onload = function() {

// --- OYUN VERİTABANI (15 Seviye - İpucu Adları Standartlaştırıldı) ---
    const gameData = [
        {
            level: 1,
            city: "Paris",
            coords: [2.3522, 48.8566],
            hint_food: "images/ipucu-paris.png", // DEĞİŞTİ
            hint_colors: ['#0055A4', '#FFFFFF', '#EF4135']
        },
        {
            level: 2,
            city: "Tokyo",
            coords: [139.6917, 35.6895],
            hint_food: "images/ipucu-tokyo.png", // DEĞİŞTİ
            hint_colors: ['#FFFFFF', '#BC002D']
        },
        {
            level: 3,
            city: "Cairo", 
            coords: [31.2357, 30.0444],
            hint_food: "images/ipucu-cairo.png", // DEĞİŞTİ
            hint_colors: ['#CE1126', '#FFFFFF', '#000000']
        },
        {
            level: 4,
            city: "Ankara",
            coords: [32.8597, 39.9334],
            hint_food: "images/ipucu-ankara.png", // DEĞİŞTİ
            hint_colors: ['#E30A17', '#FFFFFF']
        },
        {
            level: 5,
            city: "Rome", 
            coords: [12.4964, 41.9028],
            hint_food: "images/ipucu-rome.png", // DEĞİŞTİ
            hint_colors: ['#008C45', '#F4F5F0', '#CD212A']
        },
        {
            level: 6,
            city: "London", 
            coords: [-0.1276, 51.5072],
            hint_food: "images/ipucu-london.png", // DEĞİŞTİ
            hint_colors: ['#012169', '#FFFFFF', '#C8102E']
        },
        {
            level: 7,
            city: "Berlin",
            coords: [13.4050, 52.5200],
            hint_food: "images/ipucu-berlin.png", // DEĞİŞTİ
            hint_colors: ['#000000', '#DD0000', '#FFCC00']
        },
        {
            level: 8,
            city: "Madrid",
            coords: [-3.7038, 40.4168],
            hint_food: "images/ipucu-madrid.png", // DEĞİŞTİ
            hint_colors: ['#AA151B', '#F1B53B']
        },
        {
            level: 9,
            city: "Moscow", 
            coords: [37.6173, 55.7558],
            hint_food: "images/ipucu-moscow.png", // DEĞİŞTİ
            hint_colors: ['#FFFFFF', '#0039A6', '#D52B1E']
        },
        {
            level: 10,
            city: "Washington", 
            coords: [-77.0369, 38.9072],
            hint_food: "images/ipucu-washington.png", // DEĞİŞTİ
            hint_colors: ['#B22234', '#FFFFFF', '#3C3B6E']
        },
        {
            level: 11,
            city: "Mexico City", 
            coords: [-99.1332, 19.4326],
            hint_food: "images/ipucu-mexico-city.png", // DEĞİŞTİ
            hint_colors: ['#006847', '#FFFFFF', '#CE1126']
        },
        {
            level: 12,
            city: "Brasilia", 
            coords: [-47.8825, -15.7942],
            hint_food: "images/ipucu-brasilia.png", // DEĞİŞTİ
            hint_colors: ['#009B3A', '#FFCC29', '#002776']
        },
        {
            level: 13,
            city: "Buenos Aires",
            coords: [-58.3816, -34.6037],
            hint_food: "images/ipucu-buenos-aires.png", // DEĞİŞTİ
            hint_colors: ['#75AADB', '#FFFFFF', '#FFB81C']
        },
        {
            level: 14,
            city: "Beijing", 
            coords: [116.4074, 39.9042],
            hint_food: "images/ipucu-beijing.png", // DEĞİŞTİ
            hint_colors: ['#EE1C25', '#FFFF00']
        },
        {
            level: 15,
            city: "Canberra",
            coords: [149.1300, -35.2809],
            hint_food: "images/ipucu-canberra.png", // DEĞİŞTİ
            hint_colors: ['#00008B', '#FFFFFF', '#FF0000']
        }
    ];

    // Oyunu karıştırma fonksiyonunu çağır
    shuffleGameData(gameData);

    // --- DOM ELEMENTLERİNİ ALMA ---
    // ... (Bu kısım değişmedi) ...
    const startMenu = document.getElementById('start-menu');
    const btnStartGame = document.getElementById('btn-start-game');
    const mapElement = document.getElementById('map');
    const gameUI = document.getElementById('game-ui');
    const levelCountEl = document.getElementById('level-count');
    const tokenCountEl = document.getElementById('token-count');
    const guessInput = document.getElementById('guess-input');
    const btnGuess = document.getElementById('btn-guess');
    const btnHintFood = document.getElementById('btn-hint-food');
    const btnHintColors = document.getElementById('btn-hint-colors');
    const popupOverlay = document.getElementById('popup-overlay');
    const popupTitle = document.getElementById('popup-title');
    const popupContent = document.getElementById('popup-content');
    const btnPopupClose = document.getElementById('btn-popup-close');

    // --- OYUN DURUMU DEĞİŞKENLERİ ---
    // ... (Bu kısım değişmedi) ...
    let currentLevel = 0; 
    let playerTokens = 20;
    let map; 
    let gameLayer; 
    let playerPawn; 
    let isAnimating = false;

    // --- HARİTA VE OYUN KURULUM FONKSİYONU ---
    // ... (Bu fonksiyon değişmedi) ...
    function initializeGame() {
        const cartoDarkLayer = new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: 'https://{a-c}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
                attributions: '© OpenStreetMap contributors, © CARTO'
            })
        });

        const playerStyle = new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 0.5], 
                src: 'images/plane-icon.png', 
                scale: 0.1, 
                rotateWithView: true
            })
        });
        
        playerPawn = new ol.Feature(); 
        playerPawn.setStyle(playerStyle);

        gameLayer = new ol.layer.Vector({
            source: new ol.source.Vector({ features: [playerPawn] }),
            zIndex: 10 
        });

        map = new ol.Map({
            target: 'map',
            layers: [ cartoDarkLayer, gameLayer ],
            view: new ol.View({
                center: ol.proj.fromLonLat([10, 30]),
                zoom: 2, 
            }),
        });
    }

    // --- OYUN FONKSİYONLARI ---
    // ... (loadLevel, updateTokenUI, showPopup, hidePopup, checkGuess fonksiyonları değişmedi) ...
    function loadLevel(levelIndex, skipAnimation = false) {
        const level = gameData[levelIndex];
        currentLevel = levelIndex;
        levelCountEl.textContent = level.level;
        guessInput.value = "";
        updateTokenUI();

        const levelCoords = ol.proj.fromLonLat(level.coords);

        if (!playerPawn.getGeometry()) {
            playerPawn.setGeometry(new ol.geom.Point(levelCoords));
        } else {
            playerPawn.getGeometry().setCoordinates(levelCoords);
        }

        if (!skipAnimation) {
            map.getView().animate({
                center: levelCoords,
                zoom: 6, 
                duration: 2000
            });
        }
    }

    function updateTokenUI() {
        tokenCountEl.textContent = playerTokens;
        btnHintFood.disabled = (playerTokens < 10);
        btnHintColors.disabled = (playerTokens < 10);
    }

    function showPopup(title, contentHTML) {
        popupTitle.innerHTML = title;
        popupContent.innerHTML = contentHTML;
        popupOverlay.style.display = 'flex';
        popupOverlay.style.pointerEvents = 'all';
        gsap.to(popupOverlay, { duration: 0.3, opacity: 1 });
    }

    function hidePopup() {
        gsap.to(popupOverlay, { duration: 0.3, opacity: 0, onComplete: () => {
            popupOverlay.style.display = 'none';
            popupOverlay.style.pointerEvents = 'none';
        }});
    }

    function checkGuess() {
        if (isAnimating) return; 

        const answer = gameData[currentLevel].city.toLowerCase();
        const guess = guessInput.value.trim().toLowerCase();
        
        if (guess === answer) {
            playerTokens += 5;
            showPopup("Doğru!", `<p>Tebrikler! +5 Jeton kazandın.</p>`);
            
            if (currentLevel < gameData.length - 1) {
                isAnimating = true; 
                
                const nextLevelIndex = currentLevel + 1;
                
                const startCoords = ol.proj.fromLonLat(gameData[currentLevel].coords);
                const endCoords = ol.proj.fromLonLat(gameData[nextLevelIndex].coords);

                const dx = endCoords[0] - startCoords[0];
                const dy = endCoords[1] - startCoords[1];
                const rotation = Math.atan2(dy, dx);
                const olRotation = -rotation + (Math.PI / 2);
                playerPawn.getStyle().getImage().setRotation(olRotation);

                const flightPathLine = new ol.Feature({
                    geometry: new ol.geom.LineString([startCoords, startCoords])
                });
                flightPathLine.setStyle(new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: 'rgba(255, 193, 7, 0.4)',
                        width: 4
                    })
                }));
                gameLayer.getSource().addFeature(flightPathLine);

                let animProgress = { x: startCoords[0], y: startCoords[1] };
                
                gsap.to(animProgress, {
                    duration: 5.0, 
                    x: endCoords[0],
                    y: endCoords[1],
                    
                    onUpdate: function() {
                        const currentFlightCoords = [animProgress.x, animProgress.y];
                        playerPawn.getGeometry().setCoordinates(currentFlightCoords);
                        flightPathLine.getGeometry().setCoordinates([startCoords, currentFlightCoords]);
                        map.getView().setCenter(currentFlightCoords);
                    },
                    
                    onComplete: function() {
                        map.getView().animate({ zoom: 6, duration: 500 });
                        
                        setTimeout(() => {
                            hidePopup();
                            loadLevel(nextLevelIndex, true); 
                            isAnimating = false;
                        }, 500);
                    }
                });

            } else {
                showPopup("Oyun Bitti!", "<p>Tüm seviyeleri tamamladın!</p>");
                btnGuess.disabled = true;
            }
        } else {
            showPopup("Yanlış!", "<p>Tekrar dene. İpucu kullanmak ister misin?</p>");
        }
    }

    // --- Karıştırma Fonksiyonu ---
    // ... (Bu fonksiyon değişmedi) ...
    function shuffleGameData(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        array.forEach((item, index) => {
            item.level = index + 1;
        });
    }

    // --- OLAY DİNLEYİCİLERİ ---
    btnStartGame.addEventListener('click', () => {
        // ... (Bu fonksiyon değişmedi) ...
        gsap.to(startMenu, { duration: 0.5, opacity: 0, onComplete: () => {
            startMenu.style.display = 'none';
        }});
        
        gameUI.style.display = 'flex';
        gameUI.style.pointerEvents = 'all';
        gsap.to(gameUI, { duration: 0.5, opacity: 1, delay: 0.5 });
        
        loadLevel(0, false);
    });

    btnGuess.addEventListener('click', checkGuess);
    btnPopupClose.addEventListener('click', hidePopup);

    btnHintFood.addEventListener('click', () => {
        // ... (Bu fonksiyon değişmedi) ...
        if (playerTokens >= 10) {
            playerTokens -= 10;
            updateTokenUI();
            const hintImage = gameData[currentLevel].hint_food;
            showPopup("İpucu: Yöresel Yemek", `<img src="${hintImage}" alt="Yemek İpucu">`);
        }
    });

    // === DÜZELTME BURADA ===
    // 'class.' hatası 'class=' olarak düzeltildi.
    btnHintColors.addEventListener('click', () => {
        if (playerTokens >= 10) {
            playerTokens -= 10;
            updateTokenUI();
            
            const hintColors = gameData[currentLevel].hint_colors;
            
            // HATA 1: class. -> class=
            let colorHTML = '<div class="color-swatches">';
            hintColors.forEach(color => {
                // HATA 2: class. -> class=
                colorHTML += `<div class="color-swatch" style="background-color: ${color};"></div>`;
            });
            colorHTML += '</div>';
            
            showPopup("İpucu: Bayrak Renkleri", colorHTML);
        }
    });
    // === /DÜZELTME SONU ===

    // Haritayı ana menü için hemen yükle
    initializeGame();

}; // window.onload sarmalayıcısının sonu