import React from 'react';
import { Button } from './button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  totalItems: number;
}

interface PaginationContentProps {
  className?: string;
  children: React.ReactNode;
}

interface PaginationItemProps {
  className?: string;
  children: React.ReactNode;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  totalItems,
}: PaginationProps) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of{" "}
        <strong>{totalItems}</strong> items
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <div className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function PaginationContent({ className, children }: PaginationContentProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {children}
    </div>
  );
}

export function PaginationItem({ className, children }: PaginationItemProps) {
  return (
    <div className={cn("", className)}>
      {children}
    </div>
  );
}
