import ProfileSidebar from "@/components/ProfileSidebar";
import ProfileAccount from "@/components/ProfileAccount";
import TrashCanRegistration from "@/components/TrashCanRegistration";
import { useState } from "react";
import './Perfil.css';
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("account");


  return (
  <div className="profile-layout" >
      {/* SIDEBAR */}
      <ProfileSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* CONTENT */}
      <main className="profile-content">
        <div className="profile-content-wrapper">
          {activeTab === "account" && (
            <ProfileAccount />
          )}
          {activeTab === "trash-cans" && (
            <TrashCanRegistration />
          )}
        </div>
      </main>
    </div>
  );
}