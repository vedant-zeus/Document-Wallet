@@ .. @@
 -- Enable RLS on documents table
 alter table documents enable row level security;
 
+-- Create storage bucket for documents
+insert into storage.buckets (id, name, public) values ('documents', 'documents', false);
+
 -- Create policies for documents table
 create policy "Users can view own documents"
   on documents for select
@@ .. @@
   on documents for delete
   using (auth.uid() = user_id);
 
--- Create storage bucket for documents (if not exists)
-insert into storage.buckets (id, name, public) 
-select 'documents', 'documents', false
-where not exists (select 1 from storage.buckets where id = 'documents');
-
 -- Create storage policies
 create policy "Users can upload own documents"
   on storage.objects for insert
@@ .. @@
 create policy "Users can download own documents"
   on storage.objects for select
   using (bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]);
+
+create policy "Users can update own documents"
+  on storage.objects for update
+  using (bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]);