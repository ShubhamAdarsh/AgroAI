import Layout from "../components/Layout";

export default function Settings() {
  return (
    <Layout>
      <h1 className="text-3xl gradient-text mb-4">Settings ⚙️</h1>

      <div className="card">
        <p>Theme: Dark</p>
        <p>Notifications: Enabled</p>
      </div>
    </Layout>
  );
}