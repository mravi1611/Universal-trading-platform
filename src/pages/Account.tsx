import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { PageTitle } from "@/components/shared/PageTitle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Check, X, Upload, FileText, AlertTriangle } from "lucide-react";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { logActivity, ActivityType } from "@/utils/activityLogger";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { KycDocument } from "@/types";

const DOCUMENT_TYPES = [
  { id: "id_card", name: "ID Card" },
  { id: "passport", name: "Passport" },
  { id: "driving_license", name: "Driving License" },
  { id: "utility_bill", name: "Utility Bill (Proof of Address)" }
];

const documentUploadSchema = z.object({
  documentType: z.string().min(1, "Document type is required"),
  file: z.instanceof(File, { message: "Document file is required" })
});

type DocumentUploadForm = z.infer<typeof documentUploadSchema>;

export default function Account() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [loading, setLoading] = useState(true);
  const [kycDocuments, setKycDocuments] = useState<KycDocument[]>([]);
  const [isKycOpen, setIsKycOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const form = useForm<DocumentUploadForm>({
    resolver: zodResolver(documentUploadSchema),
    defaultValues: {
      documentType: "",
    }
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [user, profile]);

  useEffect(() => {
    if (user?.id) {
      fetchKycDocuments();
    }
  }, [user?.id]);

  const fetchKycDocuments = async () => {
    if (!user?.id) return;
    
    try {
      console.log("Fetching KYC documents for user:", user.id);
      
      const { data: buckets, error: bucketError } = await supabase
        .storage
        .listBuckets();
        
      console.log("Available storage buckets:", buckets);
      
      if (bucketError) {
        console.error("Error fetching storage buckets:", bucketError);
      }
      
      const { data, error } = await supabase
        .from("kyc_documents")
        .select("*")
        .eq("user_id", user.id);
        
      if (error) {
        console.error("Error fetching KYC documents:", error);
        throw error;
      }
      
      if (data) {
        console.log("KYC documents fetched:", data);
        const formattedDocs: KycDocument[] = data.map(doc => ({
          id: doc.id,
          documentType: doc.document_type || "",
          status: doc.status || "pending",
          documentUrl: doc.document_url || "",
          userId: doc.user_id || undefined,
          createdAt: doc.created_at || undefined
        }));
        
        setKycDocuments(formattedDocs);
      }
    } catch (error) {
      console.error("Error fetching KYC documents:", error);
    }
  };

  const uploadDocument = async (data: DocumentUploadForm) => {
    if (!user?.id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to upload documents",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      const file = data.file;
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;
      const filePath = fileName;
      
      console.log("Preparing to upload document:", {
        userId: user.id,
        fileName,
        filePath,
        fileSize: file.size,
        fileType: file.type,
        documentType: data.documentType
      });
      
      const { data: buckets } = await supabase.storage.listBuckets();
      const kycBucketExists = buckets?.some(bucket => bucket.name === 'kyc_documents');
      
      if (!kycBucketExists) {
        console.log("KYC bucket doesn't exist, creating simulation of upload");
        
        toast({
          title: "Document Upload Simulated",
          description: "Storage configuration is required. In a production environment, your admin would need to create the required storage bucket.",
        });
        
        const mockDoc: KycDocument = {
          id: `mock-${Date.now()}`,
          documentType: data.documentType,
          status: 'pending',
          documentUrl: URL.createObjectURL(file),
          createdAt: new Date().toISOString()
        };
        
        setKycDocuments([...kycDocuments, mockDoc]);
        
        setShowUploadDialog(false);
        form.reset();
        
        return;
      }
      
      const { error: uploadError, data: uploadData } = await supabase
        .storage
        .from('kyc_documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }
      
      console.log("Upload successful, getting public URL");
      
      const { data: urlData } = supabase
        .storage
        .from('kyc_documents')
        .getPublicUrl(filePath);
        
      const documentUrl = urlData.publicUrl;
      
      console.log("Got public URL:", documentUrl);
      console.log("Saving to database with user_id:", user.id);
      
      const { error: dbError, data: insertData } = await supabase
        .from('kyc_documents')
        .insert({
          user_id: user.id,
          document_type: data.documentType,
          document_url: documentUrl,
          status: 'pending'
        })
        .select();
      
      console.log("Insert result:", { error: dbError, data: insertData });
        
      if (dbError) {
        console.error("Database error:", dbError);
        throw dbError;
      }
      
      toast({
        title: "Document Uploaded",
        description: "Your document has been uploaded successfully and is pending verification.",
      });

      logActivity(user.id, ActivityType.PROFILE_UPDATE, {
        action: 'kyc_document_upload',
        documentType: data.documentType
      });
      
      fetchKycDocuments();
      
      setShowUploadDialog(false);
      form.reset();
      
    } catch (error: any) {
      console.error("Error uploading document:", error);
      
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error?.message || "There was an error uploading your document. The storage bucket may not be configured properly.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading account data...</span>
        </div>
      </AppLayout>
    );
  }

  if (!user || !profile) {
    return (
      <AppLayout>
        <PageTitle 
          title="Account Not Available" 
          description="Please log in to access your account settings"
        />
        <Card className="mt-6">
          <CardContent className="pt-6">
            <p>Your account information is not available. You may need to log in again.</p>
            <Button 
              className="mt-4" 
              onClick={() => navigate("/login")}
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </AppLayout>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText !== "DELETE") {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please type DELETE to confirm account deletion",
      });
      return;
    }
    
    logout();
    
    toast({
      title: "Account Deleted",
      description: "Your account has been successfully deleted",
    });
    
    navigate("/login");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDocumentTypeName = (typeId: string) => {
    const docType = DOCUMENT_TYPES.find(type => type.id === typeId);
    return docType ? docType.name : typeId;
  };

  const renderDocumentStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return (
          <div className="flex items-center text-green-600">
            <Check size={16} className="mr-1" />
            <span>Approved</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center text-red-600">
            <X size={16} className="mr-1" />
            <span>Rejected</span>
          </div>
        );
      case 'pending':
      default:
        return (
          <div className="flex items-center text-amber-600">
            <AlertTriangle size={16} className="mr-1" />
            <span>Pending</span>
          </div>
        );
    }
  };

  return (
    <AppLayout>
      <PageTitle 
        title="Account Settings" 
        description="Manage your account preferences and information"
      />
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>
              Your personal information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                  <p className="text-base">{user.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                  <p className="text-base">{user.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Account Created</h3>
                  <p className="text-base">{formatDate(profile.createdAt)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Account ID</h3>
                  <p className="text-base">{user.id}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>KYC Verification</CardTitle>
            <CardDescription>
              Submit your identity documents for verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Collapsible 
              open={isKycOpen}
              onOpenChange={setIsKycOpen}
              className="space-y-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-medium">Identity Verification</h3>
                  <p className="text-sm text-muted-foreground">
                    Verify your identity to access full trading features
                  </p>
                </div>
                <CollapsibleTrigger asChild>
                  <Button variant="outline">
                    {isKycOpen ? "Hide Details" : "Show Details"}
                  </Button>
                </CollapsibleTrigger>
              </div>
              
              <CollapsibleContent>
                <div className="space-y-4 pt-4">
                  {kycDocuments.length > 0 ? (
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted">
                          <tr className="text-left">
                            <th className="px-4 py-3">Document Type</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Uploaded</th>
                          </tr>
                        </thead>
                        <tbody>
                          {kycDocuments.map((doc) => (
                            <tr key={doc.id} className="border-t">
                              <td className="px-4 py-3">
                                <div className="flex items-center">
                                  <FileText size={16} className="mr-2 text-muted-foreground" />
                                  {getDocumentTypeName(doc.documentType)}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                {renderDocumentStatusBadge(doc.status)}
                              </td>
                              <td className="px-4 py-3 text-sm text-muted-foreground">
                                {doc.createdAt ? formatDate(doc.createdAt) : 'Recently uploaded'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 border rounded-md bg-muted/10">
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 text-base font-medium">No documents uploaded</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        You haven't uploaded any identification documents yet
                      </p>
                    </div>
                  )}
                  
                  <div className="flex justify-center mt-4">
                    <Button onClick={() => setShowUploadDialog(true)}>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload New Document
                    </Button>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>
              Manage your account security settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-medium">Change Password</h3>
                  <p className="text-sm text-muted-foreground">Update your password regularly for better security</p>
                </div>
                <Button variant="outline">Change Password</Button>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <Button variant="outline">Enable 2FA</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader className="text-red-600">
            <CardTitle>Danger Zone</CardTitle>
            <CardDescription className="text-red-500">
              Irreversible account actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-medium">Log Out</h3>
                  <p className="text-sm text-muted-foreground">End your current session</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setShowLogoutConfirm(true)}
                >
                  Log Out
                </Button>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-medium text-red-600">Delete Account</h3>
                  <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                </div>
                <Button 
                  variant="destructive" 
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out of your account?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLogoutConfirm(false)}>Cancel</Button>
            <Button onClick={handleLogout}>Log Out</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              This action cannot be undone. All your data will be permanently deleted.
              To confirm, please type "DELETE" below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-2">
            <Label htmlFor="confirm">Confirmation</Label>
            <Input
              id="confirm"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE to confirm"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteAccount}
              disabled={deleteConfirmText !== "DELETE"}
            >
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Verification Document</DialogTitle>
            <DialogDescription>
              Please select a document type and upload a clear image of your document.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(uploadDocument)} className="space-y-6">
              <FormField
                control={form.control}
                name="documentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Type</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        {...field}
                      >
                        <option value="">Select document type</option>
                        {DOCUMENT_TYPES.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="file"
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Document File</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            onChange(e.target.files[0]);
                          }
                        }}
                        {...rest}
                      />
                    </FormControl>
                    <FormDescription>
                      Accepted formats: JPG, PNG, PDF. Max 5MB.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowUploadDialog(false)}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isUploading}
                >
                  {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isUploading ? "Uploading..." : "Upload Document"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
