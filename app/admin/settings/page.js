"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Cog, DollarSign, User, Building } from "lucide-react";

export default function SettingsPage() {
	return (
		<div className="container px-4 py-6 mx-auto md:px-6">
			<h1 className="mb-6 text-3xl font-bold">Settings</h1>
			<Tabs defaultValue="general" className="space-y-6">
				<TabsList className="grid w-full grid-cols-3 mb-8">
					<TabsTrigger value="general" className="flex items-center space-x-2">
						<Cog className="w-4 h-4" />
						<span>General</span>
					</TabsTrigger>
					<TabsTrigger value="project-defaults" className="flex items-center space-x-2">
						<DollarSign className="w-4 h-4" />
						<span>Project Defaults</span>
					</TabsTrigger>
					<TabsTrigger value="user-preferences" className="flex items-center space-x-2">
						<User className="w-4 h-4" />
						<span>User Preferences</span>
					</TabsTrigger>
				</TabsList>

				<TabsContent value="general">
					<Card>
						<CardHeader>
							<CardTitle>General Settings</CardTitle>
							<CardDescription>Manage your company and application settings</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-2">
								<Label htmlFor="company-name">Company Name</Label>
								<Input id="company-name" placeholder="Enter your company name" />
							</div>
							<div className="space-y-2">
								<Label htmlFor="company-address">Company Address</Label>
								<Input id="company-address" placeholder="Enter your company address" />
							</div>
							<div className="space-y-2">
								<Label htmlFor="default-currency">Default Currency</Label>
								<Select defaultValue="usd">
									<SelectTrigger id="default-currency">
										<SelectValue placeholder="Select currency" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="usd">USD ($)</SelectItem>
										<SelectItem value="eur">EUR (€)</SelectItem>
										<SelectItem value="gbp">GBP (£)</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="flex items-center space-x-2">
								<Switch id="auto-save" />
								<Label htmlFor="auto-save">Enable auto-save</Label>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="project-defaults">
					<Card>
						<CardHeader>
							<CardTitle>Project Defaults</CardTitle>
							<CardDescription>Set default values for new projects</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-2">
								<Label htmlFor="default-tax-rate">Default Tax Rate (%)</Label>
								<Input id="default-tax-rate" type="number" placeholder="Enter default tax rate" />
							</div>
							<div className="space-y-2">
								<Label htmlFor="default-markup">Default Markup (%)</Label>
								<Input id="default-markup" type="number" placeholder="Enter default markup" />
							</div>
							<div className="space-y-2">
								<Label>Default Labor Rate ($ per hour)</Label>
								<Slider defaultValue={[50]} max={200} step={1} />
							</div>
							<div className="space-y-2">
								<Label htmlFor="default-project-type">Default Project Type</Label>
								<Select defaultValue="residential">
									<SelectTrigger id="default-project-type">
										<SelectValue placeholder="Select project type" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="residential">Residential</SelectItem>
										<SelectItem value="commercial">Commercial</SelectItem>
										<SelectItem value="industrial">Industrial</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="user-preferences">
					<Card>
						<CardHeader>
							<CardTitle>User Preferences</CardTitle>
							<CardDescription>Customize your user experience</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-2">
								<Label htmlFor="theme">Theme</Label>
								<Select defaultValue="light">
									<SelectTrigger id="theme">
										<SelectValue placeholder="Select theme" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="light">Light</SelectItem>
										<SelectItem value="dark">Dark</SelectItem>
										<SelectItem value="system">System</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="flex items-center space-x-2">
								<Switch id="notifications" />
								<Label htmlFor="notifications">Enable notifications</Label>
							</div>
							<div className="space-y-2">
								<Label htmlFor="language">Language</Label>
								<Select defaultValue="en">
									<SelectTrigger id="language">
										<SelectValue placeholder="Select language" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="en">English</SelectItem>
										<SelectItem value="es">Español</SelectItem>
										<SelectItem value="fr">Français</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label htmlFor="measurement-unit">Preferred Measurement Unit</Label>
								<Select defaultValue="imperial">
									<SelectTrigger id="measurement-unit">
										<SelectValue placeholder="Select measurement unit" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="imperial">Imperial (ft, in)</SelectItem>
										<SelectItem value="metric">Metric (m, cm)</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			<div className="flex justify-end mt-8">
				<Button className="flex items-center space-x-2">
					<Save className="w-4 h-4" />
					<span>Save All Settings</span>
				</Button>
			</div>
		</div>
	);
}
