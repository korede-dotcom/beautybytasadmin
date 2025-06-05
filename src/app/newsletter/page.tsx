"use client";

import React, { useState, useEffect } from "react";
import { Send, Users, Mail, Eye, Save, Upload, Image as ImageIcon, Type, Palette, BarChart3, RefreshCw, Edit, Trash2, ExternalLink, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import Layout from "../Layouts/Layout";
import { toast } from "@/components/ui/use-toast";

interface EmailRecipient {
  id: string;
  email: string;
  name: string;
  subscribed: boolean;
  createdAt: string;
}

interface NewsletterData {
  subject: string;
  content: string;
  htmlContent: string;
  recipients: string[];
  sendToAll: boolean;
  scheduledDate?: string;
  template: string;
}

interface SubstackPost {
  id: string;
  title: string;
  subtitle: string;
  body: string;
  isDraft: boolean;
  published_at?: string;
  url: string;
}

interface SubstackStats {
  total_subscribers: number;
  active_subscribers: number;
  total_posts: number;
  average_open_rate: number;
  average_click_rate: number;
}

const NewsletterPage: React.FC = () => {
  const [newsletterData, setNewsletterData] = useState<NewsletterData>({
    subject: '',
    content: '',
    htmlContent: '',
    recipients: [],
    sendToAll: true,
    template: 'basic'
  });

  const [emailList, setEmailList] = useState<EmailRecipient[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [searchEmail, setSearchEmail] = useState('');
  
  // Substack state
  const [substackStats, setSubstackStats] = useState<SubstackStats | null>(null);
  const [substackPosts, setSubstackPosts] = useState<SubstackPost[]>([]);
  const [substackLoading, setSubstackLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('newsletter');
  const [editingPost, setEditingPost] = useState<SubstackPost | null>(null);
  const [isEditingPost, setIsEditingPost] = useState(false);

  // Initialize data
  useEffect(() => {
    const mockEmails: EmailRecipient[] = [
      {
        id: '1',
        email: 'john@example.com',
        name: 'John Doe',
        subscribed: true,
        createdAt: '2024-01-15'
      },
      {
        id: '2',
        email: 'jane@example.com',
        name: 'Jane Smith',
        subscribed: true,
        createdAt: '2024-01-10'
      },
      {
        id: '3',
        email: 'bob@example.com',
        name: 'Bob Johnson',
        subscribed: false,
        createdAt: '2024-01-05'
      }
    ];
    setEmailList(mockEmails);
    
    // Load Substack data
    fetchSubstackStats();
    fetchSubstackPosts();
  }, []);

  // Substack API Functions
  const fetchSubstackStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/newsletter/substack/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.status) {
        setSubstackStats(result.data);
      }
    } catch (error) {
      console.error("Error fetching Substack stats:", error);
    }
  };

  const fetchSubstackPosts = async (page = 1) => {
    try {
      setSubstackLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/newsletter/substack/posts?page=${page}&limit=10`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.status) {
        setSubstackPosts(result.data.posts);
      }
    } catch (error) {
      console.error("Error fetching Substack posts:", error);
    } finally {
      setSubstackLoading(false);
    }
  };

  const createSubstackPost = async (postData: Partial<SubstackPost>) => {
    try {
      setSubstackLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/newsletter/substack/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: postData.title,
          subtitle: postData.subtitle,
          body: postData.body,
          isDraft: postData.isDraft || true
        }),
      });

      const result = await response.json();
      if (result.status) {
        toast({
          title: "Success",
          description: "Substack post created successfully!",
        });
        fetchSubstackPosts();
        fetchSubstackStats();
        return result.data.post;
      } else {
        throw new Error(result.message || 'Failed to create post');
      }
    } catch (error) {
      console.error("Error creating Substack post:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create post",
        variant: "destructive",
      });
    } finally {
      setSubstackLoading(false);
    }
  };

  const updateSubstackPost = async (postId: string, postData: Partial<SubstackPost>) => {
    try {
      setSubstackLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/newsletter/substack/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: postData.title,
          subtitle: postData.subtitle,
          body: postData.body,
          isDraft: postData.isDraft
        }),
      });

      const result = await response.json();
      if (result.status) {
        toast({
          title: "Success",
          description: "Substack post updated successfully!",
        });
        fetchSubstackPosts();
        setEditingPost(null);
        setIsEditingPost(false);
        return result.data.post;
      } else {
        throw new Error(result.message || 'Failed to update post');
      }
    } catch (error) {
      console.error("Error updating Substack post:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update post",
        variant: "destructive",
      });
    } finally {
      setSubstackLoading(false);
    }
  };

  const deleteSubstackPost = async (postId: string) => {
    try {
      setSubstackLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/newsletter/substack/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.status) {
        toast({
          title: "Success",
          description: "Substack post deleted successfully!",
        });
        fetchSubstackPosts();
        fetchSubstackStats();
      } else {
        throw new Error(result.message || 'Failed to delete post');
      }
    } catch (error) {
      console.error("Error deleting Substack post:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete post",
        variant: "destructive",
      });
    } finally {
      setSubstackLoading(false);
    }
  };

  const syncSubstackSubscribers = async () => {
    try {
      setSubstackLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/newsletter/substack/sync-subscribers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.status) {
        toast({
          title: "Success",
          description: `Synced ${result.data.syncedCount.added} new subscribers and updated ${result.data.syncedCount.updated} existing ones.`,
        });
        fetchSubstackStats();
      } else {
        throw new Error(result.message || 'Failed to sync subscribers');
      }
    } catch (error) {
      console.error("Error syncing Substack subscribers:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to sync subscribers",
        variant: "destructive",
      });
    } finally {
      setSubstackLoading(false);
    }
  };

  const handleInputChange = (field: keyof NewsletterData, value: any) => {
    setNewsletterData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEmailSelection = (emailId: string, checked: boolean) => {
    if (checked) {
      setSelectedEmails(prev => [...prev, emailId]);
    } else {
      setSelectedEmails(prev => prev.filter(id => id !== emailId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const subscribedEmails = emailList.filter(email => email.subscribed).map(email => email.id);
      setSelectedEmails(subscribedEmails);
    } else {
      setSelectedEmails([]);
    }
  };

  const handleSendNewsletter = async () => {
    if (!newsletterData.subject.trim()) {
      toast({
        title: "Error",
        description: "Please enter a subject for the newsletter.",
        variant: "destructive",
      });
      return;
    }

    if (!newsletterData.content.trim()) {
      toast({
        title: "Error",
        description: "Please enter content for the newsletter.",
        variant: "destructive",
      });
      return;
    }

    if (!newsletterData.sendToAll && selectedEmails.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one recipient.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const payload = {
        ...newsletterData,
        recipients: newsletterData.sendToAll
          ? emailList.filter(email => email.subscribed).map(email => email.email)
          : selectedEmails.map(id => emailList.find(email => email.id === id)?.email).filter(Boolean)
      };

      console.log("🚀 ~ handleSendNewsletter ~ payload:", payload);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/newsletter/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.status) {
        toast({
          title: "Success",
          description: `Newsletter sent to ${payload.recipients.length} recipients successfully!`,
        });

        // Reset form
        setNewsletterData({
          subject: '',
          content: '',
          htmlContent: '',
          recipients: [],
          sendToAll: true,
          template: 'basic'
        });
        setSelectedEmails([]);
      } else {
        throw new Error(result.message || 'Failed to send newsletter');
      }
    } catch (error) {
      console.error("Newsletter send error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send newsletter",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/newsletter/draft`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newsletterData),
      });

      const result = await response.json();

      if (result.status) {
        toast({
          title: "Success",
          description: "Newsletter draft saved successfully!",
        });
      } else {
        throw new Error(result.message || 'Failed to save draft');
      }
    } catch (error) {
      console.error("Save draft error:", error);
      toast({
        title: "Error",
        description: "Failed to save draft",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredEmails = emailList.filter(email =>
    email.email.toLowerCase().includes(searchEmail.toLowerCase()) ||
    email.name.toLowerCase().includes(searchEmail.toLowerCase())
  );

  const subscribedCount = emailList.filter(email => email.subscribed).length;
  const selectedCount = newsletterData.sendToAll ? subscribedCount : selectedEmails.length;

  return (
    <Layout>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-4xl text-gray-950">Newsletter</h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Users className="h-3 w-3" />
              {substackStats?.total_subscribers || subscribedCount} Subscribers
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Mail className="h-3 w-3" />
              {selectedCount} Selected
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={syncSubstackSubscribers}
              disabled={substackLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${substackLoading ? 'animate-spin' : ''}`} />
              Sync Substack
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
            <TabsTrigger value="substack">Substack</TabsTrigger>
          </TabsList>

          <TabsContent value="newsletter" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Newsletter Composer */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Type className="h-5 w-5" />
                      Newsletter Content
                    </CardTitle>
                    <CardDescription>
                      Create and customize your newsletter content
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="subject">Subject Line *</Label>
                      <Input
                        id="subject"
                        placeholder="Enter newsletter subject..."
                        value={newsletterData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="content">Newsletter Content *</Label>
                      <Textarea
                        id="content"
                        placeholder="Write your newsletter content here..."
                        className="min-h-[300px]"
                        value={newsletterData.content}
                        onChange={(e) => handleInputChange('content', e.target.value)}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button onClick={handleSaveDraft} variant="outline" disabled={loading}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Draft
                    </Button>
                    <Button onClick={handleSendNewsletter} disabled={loading}>
                      {loading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </div>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Newsletter
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              {/* Recipients Selection */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Recipients
                    </CardTitle>
                    <CardDescription>
                      Choose who will receive your newsletter
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="send-to-all"
                        checked={newsletterData.sendToAll}
                        onCheckedChange={(checked) => handleInputChange('sendToAll', checked)}
                      />
                      <Label htmlFor="send-to-all" className="text-sm">
                        Send to all subscribers ({subscribedCount})
                      </Label>
                    </div>
                  </CardContent>
                </Card>

                {/* Newsletter Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Quick Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Emails</span>
                      <Badge variant="outline">{emailList.length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Subscribed</span>
                      <Badge variant="default">{subscribedCount}</Badge>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Will Receive</span>
                      <Badge variant="default" className="bg-green-600">
                        {selectedCount}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="substack" className="space-y-6">
            {/* Substack Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Subscribers</CardDescription>
                  <CardTitle className="text-4xl">{substackStats?.total_subscribers || 0}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    {substackStats?.active_subscribers || 0} active subscribers
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Posts</CardDescription>
                  <CardTitle className="text-4xl">{substackStats?.total_posts || 0}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    Published articles
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Open Rate</CardDescription>
                  <CardTitle className="text-4xl">{substackStats?.average_open_rate || 0}%</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    Average engagement
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Click Rate</CardDescription>
                  <CardTitle className="text-4xl">{substackStats?.average_click_rate || 0}%</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    Average clicks
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Substack Posts Management */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Type className="h-5 w-5" />
                      Create Substack Post
                    </CardTitle>
                    <CardDescription>
                      Create a new post for your Substack newsletter
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="post-title">Title *</Label>
                      <Input
                        id="post-title"
                        placeholder="Enter post title..."
                        value={editingPost?.title || ''}
                        onChange={(e) => setEditingPost(prev => prev ? {...prev, title: e.target.value} : {
                          id: '',
                          title: e.target.value,
                          subtitle: '',
                          body: '',
                          isDraft: true,
                          url: ''
                        })}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="post-body">Content *</Label>
                      <Textarea
                        id="post-body"
                        placeholder="Write your post content here..."
                        className="min-h-[300px]"
                        value={editingPost?.body || ''}
                        onChange={(e) => setEditingPost(prev => prev ? {...prev, body: e.target.value} : {
                          id: '',
                          title: '',
                          subtitle: '',
                          body: e.target.value,
                          isDraft: true,
                          url: ''
                        })}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button
                      onClick={() => createSubstackPost(editingPost || {})}
                      disabled={substackLoading || !editingPost?.title || !editingPost?.body}
                    >
                      {substackLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Creating...
                        </div>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Create Post
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Recent Posts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {substackPosts.length > 0 ? (
                      substackPosts.slice(0, 3).map((post) => (
                        <div key={post.id} className="text-xs text-muted-foreground space-y-1">
                          <div className="flex justify-between">
                            <span className="truncate">{post.title}</span>
                            <Badge variant={post.isDraft ? "secondary" : "default"} className="text-xs">
                              {post.isDraft ? "Draft" : "Published"}
                            </Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-muted-foreground">
                        No posts yet
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </Layout>
  );
};

export default NewsletterPage;
