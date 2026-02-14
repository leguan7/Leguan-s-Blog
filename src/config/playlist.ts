export interface Song {
  /** Song title */
  title: string
  /** Artist name */
  artist: string
  /** Audio source — local path (e.g. '/music/song.mp3') or external URL */
  src: string
  /** Optional album cover image path */
  cover?: string
}

/**
 * Default playlist — add your songs here!
 *
 * Local files: place mp3 in public/music/ and use path like '/music/song.mp3'
 * External URLs: use the full URL directly
 */
export const defaultPlaylist: Song[] = [
  { title: 'Counter Attack', artist: '老伙计', src: '/music/老伙计 - counter attack.mp3' },
  { title: 'For Those Who Trust', artist: 'Bible Foundation Music', src: '/music/Bible Foundation Music - For Those Who Trust.mp3' },
  { title: '卡农（经典钢琴版）', artist: 'dylanf', src: '/music/dylanf - 卡农（经典钢琴版）.mp3' },
  { title: '菊次郎的夏天（纯钢琴）', artist: 'Masque_Jupiter', src: '/music/Masque_Jupiter - 菊次郎的夏天（纯钢琴）.mp3' },
  { title: 'Mente', artist: 'Musica para ambientar la casa', src: '/music/Musica para ambientar la casa - Mente.mp3' },
  { title: 'Smooth Relaxation', artist: 'Recover Your Spirit', src: '/music/Recover Your Spirit Melodies to Relax Your Life Soft Sound Mental Tranquility - Smooth Relaxation.mp3' },
  { title: 'Soft Mindfulness', artist: 'Recover Your Spirit', src: '/music/Recover Your Spirit Melodies to Relax Your Life Soft Sound Mental Tranquility - Soft Mindfulness.mp3' },
  { title: '영원한 사랑은 없다', artist: 'Seori', src: '/music/Seori - 영원한 사랑은 없다.mp3' },
  { title: '星辰a10', artist: '一江春水', src: '/music/一江春水 - 星辰a10.mp3' },
  { title: '星辰a7', artist: '一江春水', src: '/music/一江春水 - 星辰a7.mp3' },
  { title: '冬のソナタ ~初めから今まで', artist: '中村由利子', src: '/music/中村由利子 - 冬のソナタ-初めから今まで.mp3' },
  { title: 'L', artist: '吴宇深', src: '/music/吴宇深 - L.mp3' },
  { title: 'いつも何度でも', artist: '宗次郎', src: '/music/宗次郎 - いつも何度でも.mp3' },
  { title: 'gjg', artist: '昕宝贝儿', src: '/music/昕宝贝儿 - gjg.mp3' },
  { title: 'Always With Me', artist: '木村弓 / 奥户巴寿', src: '/music/木村弓 奥户巴寿 - Always With Me.mp3' },
  { title: '中归1', artist: '杨小白', src: '/music/杨小白 - 中归1.mp3' },
  { title: 'BNM', artist: '肆意人生', src: '/music/肆意人生 - BNM.mp3' },
  { title: '槿城', artist: '须尽欢', src: '/music/须尽欢 - 新 (44)槿城.mp3' },
  { title: '青石巷', artist: '魏琮霏', src: '/music/魏琮霏 - 青石巷.mp3' },
]
