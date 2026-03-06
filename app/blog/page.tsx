export const revalidate = 600;

export default async function BlogPage() {
  const payload = await fetch("http://localhost:3000/api/blog", {
    method: "GET",
  }).then((res) => res.json());

  console.log(payload);

  return (
    <div>
      {payload.data.map((item) => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  );
}
