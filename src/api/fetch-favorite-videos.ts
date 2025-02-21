
// favorite 영상 불러오기 객체 변환 필요(reduce)
export async function favoriteVideos(userId : string | null){
  const url = `http://localhost:5000/api/favorites/${userId}`

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("영상 불러오기 실패");
    }

    return await response.json();
  } catch (err) {
    console.error("영상 불러오기 실패", err);
    return []
  }
}

export async function toggledFavorite (userId: string, videoId: string, title: string) {
  const url = `http://localhost:5000/api/favorites/toggle`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: userId, videoId: videoId, title }),
    });

    if (!response.ok) {
      throw new Error("즐겨찾기 실패")
    }

    return await response.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}