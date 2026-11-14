"use client";

import Link from "next/link";
import {
  Building2Icon,
  CalendarClockIcon,
  FileTextIcon,
  Share2Icon,
  Table2Icon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartSkeleton } from "@/components/dashboard/ChartSkeleton";
import { StatCard } from "@/components/dashboard/StatCard";
import { EducationChart } from "@/components/dashboard/charts/EducationChart";
import { FieldsChart } from "@/components/dashboard/charts/FieldsChart";
import { GenderChart } from "@/components/dashboard/charts/GenderChart";
import { SkillChart } from "@/components/dashboard/charts/SkillChart";
import { TrendChart } from "@/components/dashboard/charts/TrendChart";
import { useStats } from "@/hooks/useStats";

export default function DashboardOverviewPage() {
  const { data: stats, isLoading, isError, refetch, isFetching } = useStats();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="grid gap-1">
          <h2 className="text-lg font-semibold tracking-tight">Overview</h2>
          <p className="text-sm text-muted-foreground">
            A live snapshot of every survey response.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/share"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <Share2Icon />
            Share survey
          </Link>
          <Link
            href="/dashboard/responses"
            className={buttonVariants({ size: "sm" })}
          >
            <Table2Icon />
            View responses
          </Link>
        </div>
      </div>

      {isError ? (
        <Card>
          <CardHeader>
            <CardTitle>Could not load analytics</CardTitle>
            <CardDescription>
              Check that the API server is running and try again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void refetch()}
              disabled={isFetching}
            >
              {isFetching ? "Retrying..." : "Retry"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total responses"
              value={stats?.totalResponses ?? 0}
              description="All survey submissions"
              icon={UsersIcon}
              isLoading={isLoading}
            />
            <StatCard
              title="Average age"
              value={stats ? `${stats.averageAge} yrs` : "0 yrs"}
              description="Mean respondent age"
              icon={TrendingUpIcon}
              isLoading={isLoading}
            />
            <StatCard
              title="Responses today"
              value={stats?.responsesToday ?? 0}
              description="Submitted since midnight UTC"
              icon={CalendarClockIcon}
              isLoading={isLoading}
            />
            <StatCard
              title="Top university"
              value={stats?.topUniversity ?? "N/A"}
              description="Most frequent institution"
              icon={Building2Icon}
              isLoading={isLoading}
            />
          </div>

          {isLoading ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <ChartSkeleton key={index} />
              ))}
            </div>
          ) : stats && stats.totalResponses > 0 ? (
            <div className="grid gap-4 lg:grid-cols-2">
              <EducationChart data={stats.educationLevel} />
              <GenderChart data={stats.gender} />
              <div className="lg:col-span-2">
                <TrendChart data={stats.submissionsPerDay} />
              </div>
              <SkillChart data={stats.skillLevel} />
              <FieldsChart data={stats.interestedFields} />
            </div>
          ) : (
            <Card>
              <CardHeader className="items-center gap-2 text-center">
                <span className="flex size-11 items-center justify-center rounded-full bg-muted">
                  <FileTextIcon className="size-5" />
                </span>
                <CardTitle>No responses yet</CardTitle>
                <CardDescription>
                  Share the public survey link to start collecting student
                  information. Charts will appear here automatically.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Link
                  href="/dashboard/share"
                  className={buttonVariants({ size: "sm" })}
                >
                  <Share2Icon />
                  Get the survey link
                </Link>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
