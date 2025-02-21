export default function videosMapping(videos: {videoId: string}[]) {
  return videos.reduce((
    acc: {[key: string]: boolean}, item: {videoId: string}    
  )=>{
    acc[item.videoId] = true;
    return acc;
  }, {})
}