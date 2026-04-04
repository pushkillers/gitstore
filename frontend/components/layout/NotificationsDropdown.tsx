"use client";

import { Dropdown, DropdownHeader, DropdownItem, DropdownDivider } from "@/components/ui/Dropdown";

export function NotificationsDropdown() {
  const notifications = [
    {
      id: 1,
      type: "project",
      title: "Novo projeto publicado",
      description: "Sistema de Chat em tempo real foi publicado",
      time: "5 min atrás",
      unread: true,
    },
    {
      id: 2,
      type: "team",
      title: "Convite para equipe",
      description: "Você foi convidado para a equipe DevSquad",
      time: "1 hora atrás",
      unread: true,
    },
    {
      id: 3,
      type: "comment",
      title: "Novo comentário",
      description: "João comentou no seu projeto",
      time: "2 horas atrás",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <Dropdown
      trigger={
        <>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#1f6feb] rounded-full border-2 border-[#0d1117]" />
          )}
        </>
      }
      className="relative p-3 text-[#7d8590] hover:text-[#e6edf3] hover:bg-[#161b22] rounded-lg transition-colors"
    >
      <DropdownHeader>Notificações</DropdownHeader>
      
      <div className="max-h-96 overflow-y-auto">
        {notifications.map((notif) => (
          <DropdownItem
            key={notif.id}
            onClick={() => console.log("Notificação clicada:", notif.id)}
          >
            <div className="flex items-start gap-3 w-full">
              {notif.unread && (
                <span className="w-2 h-2 mt-1.5 bg-[#1f6feb] rounded-full flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#e6edf3] truncate">{notif.title}</p>
                <p className="text-xs text-[#7d8590] mt-0.5">{notif.description}</p>
                <p className="text-xs text-[#7d8590] mt-1">{notif.time}</p>
              </div>
            </div>
          </DropdownItem>
        ))}
      </div>
      
      <DropdownDivider />
      
      <DropdownItem
        onClick={() => console.log("Ver todas")}
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        }
      >
        Ver todas as notificações
      </DropdownItem>
    </Dropdown>
  );
}
