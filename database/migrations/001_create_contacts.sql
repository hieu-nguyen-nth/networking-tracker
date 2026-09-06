-- Core contacts schema for the Berkeley Networking Tracker.
-- Neon Managed Auth must be enabled before this migration is applied because
-- contacts.user_id uses auth.user_id() as its ownership default.

CREATE TABLE public.contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL DEFAULT auth.user_id(),
  name text NOT NULL,
  company text,
  role text,
  where_met text,
  notes text,
  priority text NOT NULL DEFAULT 'medium',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT contacts_name_not_blank
    CHECK (char_length(btrim(name)) > 0),
  CONSTRAINT contacts_priority_valid
    CHECK (priority IN ('high', 'medium', 'low'))
);

CREATE INDEX contacts_user_id_idx ON public.contacts (user_id);

CREATE FUNCTION public.set_contacts_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER contacts_set_updated_at
BEFORE UPDATE ON public.contacts
FOR EACH ROW
EXECUTE FUNCTION public.set_contacts_updated_at();
