"use client"

import React, { useState, createContext, useContext, useEffect } from 'react'
import { Bell, ChevronLeft, ChevronRight, Clipboard, FileText, Home, LineChart, LogOut, Menu, Plus, Settings, Users, Package2, Tag, List, ChevronDown, Search, User, Moon, Sun, Ruler } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from "@/components/ui/command"
import { useTheme } from "next-themes"
import Link from 'next/link'

const SidebarContext = createContext(undefined)

export function useSidebarContext() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebarContext must be used within a SidebarProvider")
  }
  return context
}

function SidebarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(true)
  const [currentItem, setCurrentItem] = useState('Company Overview')

  const value = {
    isOpen,
    setIsOpen: (value) => setIsOpen(value),
    currentItem,
    setCurrentItem: (item) => setCurrentItem(item)
  }

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  )
}

function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <TooltipProvider>
        <div className="flex flex-col h-screen">
          <Header />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
      </TooltipProvider>
    </SidebarProvider>
  )
}

function Header() {
  const { currentItem } = useSidebarContext()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <header className="flex items-center justify-between px-4 border-b h-14 bg-background">
      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-auto p-0 text-base font-normal">
              Company Name
              <ChevronDown className="w-4 h-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>Company A</DropdownMenuItem>
            <DropdownMenuItem>Company B</DropdownMenuItem>
            <DropdownMenuItem>Company C</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Separator orientation="vertical" className="h-6" />
        <span className="text-sm text-muted-foreground">{currentItem}</span>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          className="justify-start w-64 text-sm text-muted-foreground"
          onClick={() => setOpen(true)}
        >
          <Search className="w-4 h-4 mr-2" />
          Search...
          <CommandShortcut>⌘K</CommandShortcut>
        </Button>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>
                <Clipboard className="w-4 h-4 mr-2" />
                <span>New Project</span>
              </CommandItem>
              <CommandItem>
                <FileText className="w-4 h-4 mr-2" />
                <span>New Estimate</span>
              </CommandItem>
              <CommandItem>
                <Users className="w-4 h-4 mr-2" />
                <span>Invite Team Member</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem>
                <User className="w-4 h-4 mr-2" />
                <span>Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <Settings className="w-4 h-4 mr-2" />
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
        <ThemeToggle />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <Bell className="w-5 h-5" />
              <span className="sr-only">Notifications</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Notifications</h3>
              <Button variant="ghost" size="sm">Mark all as read</Button>
            </div>
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-2 rounded-lg hover:bg-muted">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
                    JD
                  </div>
                  <div>
                    <p className="text-sm font-medium">John Doe commented on your estimate</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-2 rounded-lg hover:bg-muted">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
                    SP
                  </div>
                  <div>
                    <p className="text-sm font-medium">Sarah Parker approved your project</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <User className="w-5 h-5" />
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Switch Company</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="w-4 h-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

function Sidebar() {
  const { isOpen, setIsOpen, currentItem, setCurrentItem } = useSidebarContext()

  const menuItems = [
    { name: 'Estimates', icon: FileText, href: '/admin/' },
    { name: 'Line Items', icon: List, href: '/admin/line-items' },
    { name: 'Tags', icon: Tag, href: '/admin/tags' },
    { name: 'Units', icon: Ruler, href: '/admin/units' },
    { name: 'Users', icon: Users, href: '/admin/users' },
    { name: 'Settings', icon: Settings, href: '/admin/settings' },
  ]

  return (
    <div className={`bg-muted/40 flex-shrink-0 border-r ${isOpen ? 'w-64' : 'w-16'} transition-all duration-300 ease-in-out`}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <Package2 className="w-6 h-6" />
            {isOpen && <span className="text-lg font-bold">EstiMate Pro</span>}
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
        <Separator />
        <ScrollArea className="flex-1">
          <nav className="p-2">
            {menuItems.map((item, index) => (
              <React.Fragment key={item.name}>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Link href={item.href} passHref>
                      <Button
                        variant={currentItem === item.name ? "secondary" : "ghost"}
                        className={`w-full justify-start mb-1 ${isOpen ? 'px-4' : 'px-0 justify-center'}`}
                        onClick={() => setCurrentItem(item.name)}
                      >
                        <item.icon className={`h-5 w-5 ${isOpen ? 'mr-2' : ''}`} />
                        {isOpen && <span>{item.name}</span>}
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={10}>
                    {item.name}
                  </TooltipContent>
                </Tooltip>
                {(index === 0 || index === 3) && <Separator className="my-2" />}
              </React.Fragment>
            ))}
          </nav>
        </ScrollArea>
      </div>
    </div>
  )
}