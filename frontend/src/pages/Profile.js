import Layout from "../components/Layout";

export default function Profile() {
  return (
    <Layout>
      <h1 className="text-3xl gradient-text mb-4">Profile 👤</h1>

      <div className="card">
        <p>Name: Farmer</p>
        <p>Email: farmer@email.com</p>
      </div>
    </Layout>
  );
}