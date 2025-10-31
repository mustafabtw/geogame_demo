// 'window.onload' sarmalayıcısı, tüm kütüphanelerin yüklenmesini bekler.
window.onload = function() {

    // --- OYUN VERİTABANI (Bayrak Renkleri ile Güncellendi) ---
    const gameData = [
        {
            level: 1,
            city: "Paris",
            coords: [2.3522, 48.8566],
            hint_food: "images/ipucu-kruvasan.png",
            hint_colors: ['#0055A4', '#FFFFFF', '#EF4135'] // Mavi, Beyaz, Kırmızı (Fransa)
        },
        {
            level: 2,
            city: "Tokyo",
            coords: [139.6917, 35.6895],
            hint_food: "images/ipucu-sushi.png",
            hint_colors: ['#FFFFFF', '#BC002D'] // Beyaz, Kırmızı (Japonya)
        },
        {
            level: 3,
            city: "Cairo", // Kahire
            coords: [31.2357, 30.0444],
            hint_food: "images/ipucu-koshari.png",
            hint_colors: ['#CE1126', '#FFFFFF', '#000000'] // Kırmızı, Beyaz, Siyah (Mısır)
        },
        {
            level: 4,
            city: "Ankara",
            coords: [32.8597, 39.9334],
            hint_food: "images/ipucu-simit.png",
            hint_colors: ['#E30A17', '#FFFFFF'] // Kırmızı, Beyaz (Türkiye)
        }
        // ... 25 seviyeye kadar eklenecek
    ];

    // --- DOM ELEMENTLERİNİ ALMA ---
    const startMenu = document.getElementById('start-menu');
    const btnStartGame = document.getElementById('btn-start-game');
    const mapElement = document.getElementById('map');
    const gameUI = document.getElementById('game-ui');
    const levelCountEl = document.getElementById('level-count');
    const tokenCountEl = document.getElementById('token-count');
    const guessInput = document.getElementById('guess-input');
    const btnGuess = document.getElementById('btn-guess');
    const btnHintFood = document.getElementById('btn-hint-food');
    const btnHintColors = document.getElementById('btn-hint-colors'); // Değişti
    const popupOverlay = document.getElementById('popup-overlay');
    const popupTitle = document.getElementById('popup-title');
    const popupContent = document.getElementById('popup-content');
    const btnPopupClose = document.getElementById('btn-popup-close');

    // --- OYUN DURUMU DEĞİŞKENLERİ ---
    let currentLevel = 0; 
    let playerTokens = 20;
    let map; 
    let gameLayer; 
    let playerPawn; 
    let gamePathCoords; 

    // --- HARİTA VE OYUN KURULUM FONKSİYONU ---
    function initializeGame() {
        gamePathCoords = gameData.map(level => level.coords).map(coord => ol.proj.fromLonLat(coord));
        
        const cartoDarkLayer = new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: 'https://{a-c}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
                attributions: '© OpenStreetMap contributors, © CARTO'
            })
        });

        const playerStyle = new ol.style.Style({
            image: new ol.style.Circle({
                radius: 10,
                fill: new ol.style.Fill({ color: '#FFFFFF' }),
                stroke: new ol.style.Stroke({ color: 'rgba(255,255,255,0.3)', width: 3 })
            })
        });
        playerPawn = new ol.Feature({
            geometry: new ol.geom.Point(gamePathCoords[currentLevel])
        });
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

        setTimeout(() => {
            loadLevel(0); 
        }, 1000); 
    }

    // --- OYUN FONKSİYONLARI ---
    function loadLevel(levelIndex) {
        // ... (loadLevel fonksiyonu aynı, değişiklik yok) ...
        const level = gameData[levelIndex];
        currentLevel = levelIndex;
        levelCountEl.textContent = level.level;
        guessInput.value = "";
        updateTokenUI();
        map.getView().animate({
            center: ol.proj.fromLonLat(level.coords),
            zoom: 6, 
            duration: 2000
        });
        playerPawn.getGeometry().setCoordinates(ol.proj.fromLonLat(level.coords));
    }

    function updateTokenUI() {
        tokenCountEl.textContent = playerTokens;
        btnHintFood.disabled = (playerTokens < 10);
        btnHintColors.disabled = (playerTokens < 10); // Değişti
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
        // ... (checkGuess fonksiyonu aynı, değişiklik yok) ...
        const answer = gameData[currentLevel].city.toLowerCase();
        const guess = guessInput.value.trim().toLowerCase();
        if (guess === answer) {
            playerTokens += 5;
            showPopup("Doğru!", `<p>Tebrikler! +5 Jeton kazandın.</p>`);
            if (currentLevel < gameData.length - 1) {
                const nextLevelIndex = currentLevel + 1;
                const newArc = new ol.Feature({
                    geometry: new ol.geom.LineString([
                        ol.proj.fromLonLat(gameData[currentLevel].coords),
                        ol.proj.fromLonLat(gameData[nextLevelIndex].coords)
                    ])
                });
                newArc.setStyle(new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: 'rgba(255, 193, 7, 0.4)',
                        width: 4
                    })
                }));
                gameLayer.getSource().addFeature(newArc);
                setTimeout(() => {
                    hidePopup();
                    loadLevel(nextLevelIndex);
                }, 2000);
            } else {
                showPopup("Oyun Bitti!", "<p>Tüm seviyeleri tamamladın!</p>");
                btnGuess.disabled = true;
            }
        } else {
            showPopup("Yanlış!", "<p>Tekrar dene. İpucu kullanmak ister misin?</p>");
        }
    }

    // --- OLAY DİNLEYİCİLERİ ---
    btnStartGame.addEventListener('click', () => {
        // ... (btnStartGame dinleyicisi aynı, değişiklik yok) ...
        gsap.to(startMenu, { duration: 0.5, opacity: 0, onComplete: () => {
            startMenu.style.display = 'none';
        }});
        gameUI.style.display = 'flex';
        gameUI.style.pointerEvents = 'all';
        gsap.to(gameUI, { duration: 0.5, opacity: 1, delay: 0.5 });
        initializeGameLayers(); 
        setTimeout(() => {
            loadLevel(0);
        }, 500);
    });

    btnGuess.addEventListener('click', checkGuess);
    btnPopupClose.addEventListener('click', hidePopup);

    btnHintFood.addEventListener('click', () => {
        // ... (btnHintFood dinleyicisi aynı, değişiklik yok) ...
        if (playerTokens >= 10) {
            playerTokens -= 10;
            updateTokenUI();
            const hintImage = gameData[currentLevel].hint_food;
            showPopup("İpucu: Yöresel Yemek", `<img src="${hintImage}" alt="Yemek İpucu">`);
        }
    });

    // === DEĞİŞİKLİK BURADA: Plaka Kodu -> Bayrak Renkleri ===
    btnHintColors.addEventListener('click', () => {
        if (playerTokens >= 10) {
            playerTokens -= 10;
            updateTokenUI();
            
            // Renkleri al
            const hintColors = gameData[currentLevel].hint_colors;
            
            // Renk kutuları için HTML oluştur
            let colorHTML = '<div class="color-swatches">';
            hintColors.forEach(color => {
                colorHTML += `<div class="color-swatch" style="background-color: ${color};"></div>`;
            });
            colorHTML += '</div>';
            
            showPopup("İpucu: Bayrak Renkleri", colorHTML);
        }
    });

}; // window.onload sarmalayıcısının sonu