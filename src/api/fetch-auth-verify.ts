export default async function loginVerify () {
  const url = `http://localhost:5000/api/auth/verify`
  const token = localStorage.getItem("token");

  if (!token) return console.error("토큰이 없습니다.");

  try {
    const response = await fetch(url, {
      headers: {Authorization: `Bearer ${token}`}
    });

    if(!response.ok) {
      throw new Error("Failed to verify login");
    }

    return await response.json();
  } catch(err) {
    console.error(err);
    return null
  }
  
  }


