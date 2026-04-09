"use client"

import React from "react"

interface MenuItemProps {
  children?: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  icon?: React.ReactNode
  isActive?: boolean
}

export function MenuItem({ children, onClick, disabled = false, icon, isActive = false }: MenuItemProps) {
  return (
    <button
      className={`relative block w-full h-12 text-left group transition-all duration-200 rounded-lg px-3
        ${disabled ? "text-gray-400 dark:text-gray-500 cursor-not-allowed" : "text-gray-800 dark:text-gray-200"}
        ${isActive ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" : "hover:bg-gray-100 dark:hover:bg-white/5"}
      `}
      role="menuitem"
      onClick={onClick}
      disabled={disabled}
    >
      <span className="flex items-center gap-3 h-full">
        {icon && (
          <span className="h-5 w-5 transition-all duration-200 group-hover:scale-110">
            {icon}
          </span>
        )}
        <span className="text-sm font-medium">{children}</span>
      </span>
    </button>
  )
}

export function MenuContainer({ children, isExpanded }: { children: React.ReactNode; isExpanded: boolean }) {
  const childrenArray = React.Children.toArray(children)

  return (
    <div 
      className={`relative w-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isExpanded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
      }`}
    >
      <div className="flex flex-col gap-1">
        {childrenArray.map((child, index) => (
          <div 
            key={index} 
            className="will-change-transform"
            style={{
              transform: `translateY(${isExpanded ? 0 : (index + 1) * 10}px)`,
              opacity: isExpanded ? 1 : 0,
              transition: `transform 400ms cubic-bezier(0.16, 1, 0.3, 1) ${index * 40}ms, opacity 300ms ease ${index * 40}ms`,
            }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}
