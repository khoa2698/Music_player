
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const playlist = $('.playlist')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const repeatBtn = $('.btn-repeat')
const radomBtn = $('.btn-random')

var count = 0
var arrTemp = [] 


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    isTimeUpdate: false,
    songs: [
        {
            name: 'Chiều vắng',
            singer: "Trung Quân Idol",
            path: "./assets/music/ChieuVang-TrungQuanIdol.mp3",
            image: "./assets/img/Chieu_Vang.jpg"
        },
        {
            name: 'Chúng ta của hiện tại',
            singer: "Sơn Tùng - MTP",
            path: "./assets/music/Chung-Ta-Cua-Hien-Tai-Son-Tung-M-TP.mp3",
            image: "./assets/img/chung-ta-cua-hien-tai.jpg"
        },
        {
            name: 'Không cần thêm một ai nữa',
            singer: "Mr.Siro x BigDaddy",
            path: "./assets/music/Khong-Can-Them-Mot-Ai-Nua-Mr-Siro-BigDaddy.mp3",
            image: "./assets/img/Khong_can_them_mot_ai_nua.jpg"
        },
        {
            name: 'Leyla',
            singer: "Mesto",
            path: "./assets/music/Leyla-Mesto.mp3",
            image: "./assets/img/Leyla.jpg"
        },
        {
            name: 'Memories',
            singer: "Maroon 5",
            path: "./assets/music/Memories-Maroon 5.mp3",
            image: "./assets/img/memories.jpg"
        },
        {
            name: 'Muộn rồi sao vẫn còn',
            singer: "Sơn Tùng - MTP",
            path: "./assets/music/Muon Roi Ma Sao Con - Son Tung M TP.mp3",
            image: "./assets/img/Muon_roi_sao_van_con.png"
        },
        {
            name: 'Sau này',
            singer: "Tăng Phúc",
            path: "./assets/music/Sau-Nay-Tang-Phuc.mp3",
            image: "./assets/img/Sau_nay.jpg"
        },
        {
            name: 'Shallow',
            singer: "Lady Gaga x Bradley Cooper",
            path: "./assets/music/Shallow-Lady-Gaga-Bradley-Cooper.mp3",
            image: "./assets/img/Shallow.jpg"
        }
    ],
    render: function () {
        const htmls = this.songs.map((item, index) => {
            return `
            <div data-index="${index}" class="song ${index === this.currentIndex ? 'active' : ''
                }">
                    <div
                        class="thumb"
                        style="background-image: url('${item.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${item.name}</h3>
                        <p class="author">${item.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>`;
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvent: function() {
        const _this = this
        //Xử lý CD quay/dừng
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 13000, // quay trong 13s thì hết 1 vòng
            iterations: Infinity // lặp vòng quay vô cùng
        })
        cdThumbAnimate.pause()
        //Xử lý phóng to thu nhỏ CD
        const cdWidth = cd.offsetWidth
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        //Xử lý khi click play
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            } 
        }
        // Khi song được play
        audio.onplay = function() {
            _this.isPlaying = true 
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        // Khi song bị pause
        audio.onpause = function() {
            _this.isPlaying = false 
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        //khi thanh tiến độ Song thay đổi
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        //Xử lý khi tua bài hát
        //cách 1:
        progress.oninput = function(e){
            // từ số phần trăm của giây convert sang giây
            const seekTime = audio.duration / 100 * e.target.value; 
            audio.currentTime = seekTime;
            // audio.play();
        },
        //Cách 2 - bị giật:
        // progress.onpointerdown = function() {
        //     _this.isTimeUpdate = true;
        //   },
  
        //   progress.onchange = function(e) {
        //     _this.isTimeUpdate = false;
        //     audio.currentTime = e.target.value / 100 * audio.duration;
        //   }
        //Cách 3 (Sơn Đặng) - bị giật:
        // progress.onchange = function(e) {
        //     const seekTime = audio.duration / 100 * e.target.value
        //     progress.currentTime = seekTime
        // },

        //Khi next bài hát
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.randomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.scrollToActiveSong()
        }
        //Khi prevnext bài hát
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.randomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
        }
        //Xử lý bật/tắt random bài hát
        radomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            radomBtn.classList.toggle('active', _this.isRandom)
        }
        //Khi lặp lại bài hát
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        //Xử lý next song khi audio ended
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        //lắng nghe hành vi click vào playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.option')) {
                //Xử lý khi click vào song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    audio.play()
                }
                //Xử lý khi click vào song option
                if (e.target.closest('.option')) {
                    console.log(e.target)
                }
            }
        }
    },
    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length-1
        }
        this.loadCurrentSong()
    },
    randomSong: function() {
        let newIndex
        newIndex = Math.floor(Math.random() * this.songs.length)
        if (count > 0) {
            do {
                newIndex = Math.floor(Math.random() * this.songs.length)
                var isChecked = arrTemp.includes(newIndex)
            } while (isChecked)
        }
        arrTemp[count] = newIndex
        this.currentIndex = newIndex
        this.loadCurrentSong()
        if(count == this.songs.length - 1){
            arrTemp = []
            count = -1
        }
        count++
    },
    repeatSong: function() {
        this.currentIndex
        this.loadCurrentSong()
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: "smooth",
                block: 'end'
            }
            )
        }, 300)
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path

        if ($('.song.active')) {
            $('.song.active').classList.remove('active');
          }
          const list = $$('.song');
          list.forEach((song) => {
            if (Number(song.getAttribute('data-index')) === this.currentIndex) {
              song.classList.add('active');
            }
          });
    },
    start: function () {
        //Dịnh nghĩa các thuộc tính cho Object
        this.defineProperties()

        //Lắng nghe và xử lý các sự kiện (DOM event)
        this.handleEvent()

        //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()
        //Render playlist
        this.render()
    }
}

app.start()