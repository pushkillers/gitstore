"use client";

import { useState } from "react";
import { Dropdown, DropdownItem, DropdownDivider } from "@/components/ui/Dropdown";
import { NewProjectModal } from "@/components/features/projects/NewProjectModal";
import { useRouter } from "next/navigation";

export function CreateMenuDropdown() {
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <Dropdown
        trigger={
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Criar</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
              <path d="M4.427 7.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 7H4.604a.25.25 0 00-.177.427z"/>
            </svg>
          </>
        }
        className="flex items-center gap-2 px-5 py-2.5 text-base font-semibold text-[#e6edf3] hover:bg-[#161b22] rounded-lg transition-colors border border-[#30363d] hover:border-[#484f58]"
      >
        <DropdownItem
          onClick={() => setModalOpen(true)}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          }
        >
          Publicar Projeto
        </DropdownItem>

        <DropdownItem
          onClick={() => router.push("/teams")}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        >
          Nova Equipe
        </DropdownItem>


      </Dropdown>

      <NewProjectModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
