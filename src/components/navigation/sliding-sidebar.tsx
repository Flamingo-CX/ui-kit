"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../utils'
import { SlidingSidebarConfig, NavigationItem } from '../../types/navigation'
import { Button } from '../ui/button'

export interface SlidingSidebarProps {
  config: SlidingSidebarConfig
  children?: React.ReactNode
}

export function SlidingSidebar({ config, children }: SlidingSidebarProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedItems(newExpanded)
  }

  const renderMenuItem = (item: NavigationItem, level = 0): React.ReactNode => {
    // If custom element provided, render it
    if (item.element) {
      return <div key={item.id}>{item.element}</div>
    }

    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.has(item.id)

    if (hasChildren) {
      const chevronIcon = (
        <svg 
          className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-90")}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      )

      return (
        <div key={item.id} className="space-y-1">
          <Button
            variant="ghost-nav"
            onClick={() => toggleExpanded(item.id)}
            leftIcon={item.icon}
            rightIcon={chevronIcon}
            className={cn(
              "w-full justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors h-auto",
              level === 0 ? "pl-3" : "pl-6",
              item.isActive ? "bg-ods-accent text-ods-text-on-accent hover:bg-ods-accent/90" : "text-ods-text-primary hover:bg-ods-border"
            )}
          >
            {item.label}
            {item.badge !== undefined && (
              <span className="ml-2">{item.badge}</span>
            )}
          </Button>
          
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ 
                  duration: 0.15, 
                  ease: "easeOut",
                  height: { duration: 0.2 },
                  opacity: { duration: 0.1 }
                }}
                className="overflow-hidden"
              >
                <div className="space-y-1 pl-4">
                  {item.children!.map(child => renderMenuItem(child, level + 1))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )
    }

    // Leaf node - either link or button
    if (item.href) {
      // For Next.js apps, onClick handler should handle navigation
      return (
        <Button
          key={item.id}
          variant="ghost-nav"
          onClick={() => {
            // Let the parent handle navigation
            item.onClick?.()
            config.onClose()
          }}
          leftIcon={item.icon}
          className={cn(
            "w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors h-auto",
            level === 0 ? "pl-3" : "pl-6",
            item.isActive 
              ? "bg-ods-accent text-ods-text-on-accent hover:bg-ods-accent/90" 
              : "text-ods-text-primary hover:bg-ods-border"
          )}
        >
          {item.label}
          {item.badge !== undefined && (
            <span className="ml-auto">{item.badge}</span>
          )}
        </Button>
      )
    }

    return (
      <Button
        key={item.id}
        variant="ghost-nav"
        onClick={() => {
          item.onClick?.()
          config.onClose()
        }}
        leftIcon={item.icon}
        className={cn(
          "w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors h-auto",
          level === 0 ? "pl-3" : "pl-6",
          item.isActive 
            ? "bg-ods-accent text-ods-text-on-accent hover:bg-ods-accent/90" 
            : "text-ods-text-primary hover:bg-ods-border"
        )}
      >
        {item.label}
        {item.badge !== undefined && (
          <span className="ml-auto">{item.badge}</span>
        )}
      </Button>
    )
  }

  if (!mounted) {
    return <div>{children}</div>
  }

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {config.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.3, 
              ease: [0.4, 0, 0.2, 1]
            }}
            className="fixed inset-0 top-16 bg-black/50 z-[9998]"
            onClick={() => config.onClose()}
          />
        )}
      </AnimatePresence>

      {/* Sliding Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: config.isOpen ? 0 : (config.position === 'right' ? "100%" : "-100%")
        }}
        transition={{ 
          type: "spring", 
          damping: 25, 
          stiffness: 300,
          mass: 0.8,
          restDelta: 0.01,
          velocity: config.isOpen ? 5 : -5
        }}
        className={cn(
          "fixed top-16 bottom-0 z-[9999] w-64 bg-ods-card border-ods-border flex flex-col shadow-xl",
          config.position === 'right' ? "right-0 border-l" : "left-0 border-r",
          config.className
        )}
      >
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {config.items.map(item => renderMenuItem(item))}
        </nav>

        {/* Footer */}
        {config.footer && (
          <div className="p-4 border-t border-ods-border">
            {config.footer}
          </div>
        )}
      </motion.aside>

      {/* Content area */}
      <div className="relative min-h-screen">
        {children}
      </div>
    </>
  )
}