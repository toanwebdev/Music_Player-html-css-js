const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'PLAYER'

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')

const player = $('.player')
const playBtn = $('.btn.btn-toggle-play')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')

const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
	currentIndex: 0,
	isPlaying: false,
	isRandom: false,
	isRepeat: false,
	config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {
		isRandom: false,
		isRepeat: false,
	},
	songs: [
		{
			name: 'Yêu Đương Khó Quá Thì Chạy Về Khóc Với Anh',
			singer: 'Erik',
			path: './assets/music/song1.mp3',
			image: './assets/image/song1.jpg',
		},
		{
			name: 'Người Em Cố Đô',
			singer: 'Rum x ĐAA',
			path: './assets/music/song2.mp3',
			image: './assets/image/song2.jpg',
		},
		{
			name: 'Đường Tôi Chở Em Về',
			singer: 'Bùi Trường Linh',
			path: './assets/music/song3.mp3',
			image: './assets/image/song3.jpg',
		},
		{
			name: 'Trên Tình Bạn Dưới Tình Yêu',
			singer: 'MIN',
			path: './assets/music/song4.mp3',
			image: './assets/image/song4.jpg',
		},
		{
			name: 'Phải Chăng Em Đã Yêu?',
			singer: 'RedT',
			path: './assets/music/song5.mp3',
			image: './assets/image/song5.jpg',
		},
		{
			name: 'Sài Gòn Đau Lòng Quá',
			singer: 'Hứa Kim Tuyền',
			path: './assets/music/song6.mp3',
			image: './assets/image/song6.jpg',
		},
		{
			name: 'Chờ Ngày Mưa Tan',
			singer: 'Noo Phước Thịnh',
			path: './assets/music/song7.mp3',
			image: './assets/image/song7.jpg',
		},
		{
			name: 'Hẹn Một Mai',
			singer: 'Bùi Anh Tuấn',
			path: './assets/music/song8.mp3',
			image: './assets/image/song8.jpg',
		},
		{
			name: 'Sợ Rằng Em Biết Anh Còn Yêu Em',
			singer: 'Juu Đăng Dũng',
			path: './assets/music/song9.mp3',
			image: './assets/image/song9.jpg',
		},
		{
			name: 'Hoa Nở Không Màu',
			singer: 'Hoài Lâm',
			path: './assets/music/song10.mp3',
			image: './assets/image/song10.jpg',
		},
	],

	setConfig: function (key, value) {
		this.config[key] = value
		localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
	},

	render: function () {
		const htmls = this.songs.map((song, index) => {
			return `<div data-index=${index} class="song ${
				index === this.currentIndex ? 'active' : ''
			}">
                <div class="thumb" style="background-image: url('${
									song.image
								}')">
                </div>
                <div class="body">
                  <h3 class="title">${song.name}</h3>
                  <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                  <i class="fas fa-ellipsis-h"></i>
                </div>
              </div>`
		})

		playlist.innerHTML = htmls.join('')
	},

	defineProperties: function () {
		Object.defineProperty(this, 'currentSong', {
			get: function () {
				return this.songs[this.currentIndex]
			},
		})
	},

	handleEvents: function () {
		const _this = this
		const cdWidth = cd.offsetWidth

		// xử lý CD quay / dừng
		const cdThumbAnimate = cdThumb.animate([{ transform: 'rotate(360deg)' }], {
			duration: 10000,
			iterations: Infinity,
		})

		cdThumbAnimate.pause()

		// xử lý phóng to / thu nhỏ CD
		document.onscroll = function () {
			const scrollTop = window.scrollY || document.documentElement.scrollTop
			const newCdWidth = cdWidth - scrollTop

			cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
			cd.style.opacity = newCdWidth / cdWidth
		}

		// xử lý khi click play
		playBtn.onclick = function () {
			if (_this.isPlaying) {
				audio.pause()
			} else {
				audio.play()
			}
		}

		// khi song được play
		audio.onplay = function () {
			_this.isPlaying = true
			player.classList.add('playing')
			cdThumbAnimate.play()
		}

		// khi song bị pause
		audio.onpause = function () {
			_this.isPlaying = false
			player.classList.remove('playing')
			cdThumbAnimate.pause()
		}

		// khi tiến độ bài hát thay đổi
		audio.ontimeupdate = function () {
			if (audio.duration) {
				const progressPercent = Math.floor(
					(audio.currentTime / audio.duration) * 100,
				)
				progress.value = progressPercent
			}
		}

		// xử lý khi tua song
		progress.oninput = function (e) {
			const seekTime = (audio.duration / 100) * e.target.value
			audio.currentTime = seekTime
		}

		// khi prev song
		prevBtn.onclick = function () {
			if (_this.isRandom) {
				_this.randomSong()
			} else {
				_this.prevSong()
			}
			audio.play()
			_this.render()
			_this.scrollActiveSong()
		}

		// khi next song
		nextBtn.onclick = function () {
			if (_this.isRandom) {
				_this.randomSong()
			} else {
				_this.nextSong()
			}
			audio.play()
			_this.render()
			_this.scrollActiveSong()
		}

		// bật / tắt random song
		randomBtn.onclick = function (e) {
			_this.isRandom = !_this.isRandom
			_this.setConfig('isRandom', _this.isRandom)
			randomBtn.classList.toggle('active', _this.isRandom)
		}

		// xử lý lặp lại một song
		repeatBtn.onclick = function () {
			_this.isRepeat = !_this.isRepeat
			_this.setConfig('isRepeat', _this.isRepeat)
			repeatBtn.classList.toggle('active', _this.isRepeat)
		}

		// xử lý next song khi audio ended
		audio.onended = function () {
			if (_this.isRepeat) {
				audio.play()
			} else {
				nextBtn.click()
			}
		}

		// lắng nghe hành vi click playlist
		playlist.onclick = function (e) {
			const songNode = e.target.closest('.song:not(.active)')
			if (songNode || e.target.closest('.option')) {
				if (!e.target.closest('.option')) {
					_this.currentIndex = Number(songNode.dataset.index)
					_this.loadCurrentSong()
					audio.play()
					_this.render()
				}
			}
		}
	},

	loadCurrentSong: function () {
		heading.textContent = this.currentSong.name
		cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
		audio.src = this.currentSong.path
	},

	loadConfig: function () {
		this.isRandom = this.config.isRandom
		this.isRepeat = this.config.isRepeat
	},

	prevSong: function () {
		this.currentIndex--
		if (this.currentIndex < 0) {
			this.currentIndex = this.songs.length - 1
		}
		this.loadCurrentSong()
	},

	nextSong: function () {
		this.currentIndex++
		if (this.currentIndex >= this.songs.length) {
			this.currentIndex = 0
		}
		this.loadCurrentSong()
	},

	randomSong: function () {
		let newIndex
		do {
			newIndex = Math.floor(Math.random() * this.songs.length)
		} while (newIndex === this.currentIndex)

		this.currentIndex = newIndex
		this.loadCurrentSong()
	},

	scrollActiveSong: function () {
		setTimeout(() => {
			$('.song.active').scrollIntoView({
				behavior: 'smooth',
				block: 'nearest',
			})
		}, 200)
	},

	start: function () {
		// gắn cấu hình từ config vào ứng dụng
		this.loadConfig()

		// Định nghĩa các thuộc tính cho object
		this.defineProperties()

		// Lắng nghe / xử lý các sự kiện (DOM Events)
		this.handleEvents()

		// Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
		this.loadCurrentSong()

		// Render play list
		this.render()

		// Hiển thị trạng thái ban đầu
		randomBtn.classList.toggle('active', this.isRandom)
		repeatBtn.classList.toggle('active', this.isRepeat)
	},
}

app.start()
