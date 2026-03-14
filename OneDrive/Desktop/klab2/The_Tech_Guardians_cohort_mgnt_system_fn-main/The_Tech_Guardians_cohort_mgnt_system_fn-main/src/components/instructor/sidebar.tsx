 'use client'

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { Calendar, Home, Users, BookOpen, FileText, Shield, GraduationCap, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function AppSidebar({ pathname }: { pathname: string }) {
  const navItems = [
    { icon: Home, label: 'Dashboard', href: '/instructor', match: /^\/instructor(\/)?$/ },
    { icon: GraduationCap, label: 'Courses', href: '/instructor/courses', match: /\/courses/ },
    { icon: BookOpen, label: 'Modules', href: '/instructor/modules', match: /\/modules/ },
    { icon: FileText, label: 'Lessons', href: '/instructor/lessons', match: /\/lessons/ },
    { icon: Users, label: 'Learners', href: '/instructor/learners', match: /\/learners/ },
    { icon: Shield, label: 'Moderation', href: '/instructor/moderation', match: /\/moderation/ },
    { icon: BarChart3, label: 'Analytics', href: '/instructor/analytics', match: /\/analytics/ },
  ]

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Instructor Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <Link href={item.href} className={pathname.match(item.match) ? 'bg-accent text-accent-foreground' : ''}>
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
