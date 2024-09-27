export default async function Home({ params }: { params: { id: string } }) {
  // const hello = await api.post.hello({ text: 'from tRPC' });
  //

  return <div>admin page {params.id}</div>;
}
