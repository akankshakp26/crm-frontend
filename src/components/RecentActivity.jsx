import React, { useEffect, useState } from "react";
import { CheckCircle, UserPlus, MessageSquare, Clock } from "lucide-react";
import { getActivityLogs } from "../utils/activityStore";

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    setActivities(getActivityLogs());
  }, []);

  const getIconData = (type) => {
    switch (type) {
      case "lead_add":
        return { Icon: UserPlus, color: "text-blue-600", bg: "bg-blue-50" };
      case "lead_convert":
        return { Icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" };
      case "note":
        return { Icon: MessageSquare, color: "text-amber-600", bg: "bg-amber-50" };
      default:
        return { Icon: Clock, color: "text-slate-600", bg: "bg-slate-100" };
    }
  };

  const formatTime = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 60000);
    if (diff < 60) return `${diff} mins ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
    return "Yesterday";
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm mt-8">
      <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Clock className="text-blue-600" /> Recent Activity
      </h3>

      {activities.length === 0 ? (
        <p className="text-slate-400 font-medium">No recent activity yet.</p>
      ) : (
        <div className="space-y-6">
          {activities.map((act, i) => {
            const { Icon, color, bg } = getIconData(act.type);

            return (
              <div key={act.id} className="flex gap-4 relative">
                {i !== activities.length - 1 && (
                  <div className="absolute left-6 top-10 w-0.5 h-10 bg-slate-100"></div>
                )}
                <div className={`h-12 w-12 rounded-2xl ${bg} ${color} flex items-center justify-center shrink-0`}>
                  <Icon size={20} />
                </div>
                <div className="pt-1">
                  <p className="font-bold text-slate-800">{act.text}</p>
                  <p className="text-sm text-slate-400 font-medium">{formatTime(act.createdAt)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;