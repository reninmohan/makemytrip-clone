import { UserProfile } from "../components/UserProfile";

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container py-8">
          <UserProfile />
        </div>
      </main>
    </div>
  );
}
