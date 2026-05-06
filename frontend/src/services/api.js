export const runAI = async (task, usecase) => {
  const res = await fetch("http://127.0.0.1:8000/run", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ task, usecase }),
  });

  return res.json();
};