-- Expose contacts to signed-in Data API users while enforcing ownership in
-- Postgres. Anonymous users receive no contacts-table privileges.

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts FORCE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.contacts FROM anonymous;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.contacts TO authenticated;

CREATE POLICY contacts_select_own
ON public.contacts
FOR SELECT
TO authenticated
USING (auth.user_id() = user_id);

CREATE POLICY contacts_insert_own
ON public.contacts
FOR INSERT
TO authenticated
WITH CHECK (auth.user_id() = user_id);

CREATE POLICY contacts_update_own
ON public.contacts
FOR UPDATE
TO authenticated
USING (auth.user_id() = user_id)
WITH CHECK (auth.user_id() = user_id);

CREATE POLICY contacts_delete_own
ON public.contacts
FOR DELETE
TO authenticated
USING (auth.user_id() = user_id);
