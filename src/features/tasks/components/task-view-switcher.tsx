import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DottedSeparator } from "@/components/dotted-separator";

export default function TaskViewSwitcher() {
  return (
    <Tabs defaultValue="account" className="flex-1 w-full border rounded-lg">
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="w-full flex flex-col gap-y-2 lg:flex-row items-center justify-between">
          <div className="">
            <TabsList className="w-full lg:w-auto">
              <TabsTrigger value="table" className="h-8 w-full lg:w-auto">
                Table
              </TabsTrigger>
            </TabsList>
            <TabsList className="w-full lg:w-auto">
              <TabsTrigger value="kanban" className="h-8 w-full lg:w-auto">
                Kanban
              </TabsTrigger>
            </TabsList>
            <TabsList className="w-full lg:w-auto">
              <TabsTrigger value="calendar" className="h-8 w-full lg:w-auto">
                Calendar
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="">
            <Button size="sm" className="w-full lg:w-auto">
              <PlusIcon className="size-4 mr-2" />
              New
            </Button>
          </div>
        </div>
        <DottedSeparator className="my-4" />
        Data Filters
        <DottedSeparator className="my-4" />
        <TabsContent value="table" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Make changes to your account here. Click save when you&apos;re
                done.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="Pedro Duarte" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue="@peduarte" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="kanban" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password here. After saving, you&apos;ll be logged
                out.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="current">Current password</Label>
                <Input id="current" type="password" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">New password</Label>
                <Input id="new" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="calendar" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password here. After saving, you&apos;ll be logged
                out.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="current">Current password</Label>
                <Input id="current" type="password" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">New password</Label>
                <Input id="new" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </div>
    </Tabs>
  );
}
