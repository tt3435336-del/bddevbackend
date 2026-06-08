CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  lu BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP(6) NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.produits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  prix INTEGER NOT NULL DEFAULT 0,
  categorie TEXT NOT NULL,
  couleurs TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  badge TEXT NOT NULL DEFAULT 'Aucun',
  image_url TEXT NOT NULL DEFAULT '',
  date_ajout TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.commandes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom_complet TEXT NOT NULL,
  telephone TEXT NOT NULL,
  adresse TEXT NOT NULL,
  quartier TEXT NOT NULL DEFAULT '',
  mode_paiement TEXT NOT NULL CHECK (mode_paiement IN ('wave', 'orange_money', 'free_money', 'paiement_livraison')),
  statut TEXT NOT NULL DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'confirmee', 'en_cours', 'livree', 'annulee')),
  total INTEGER NOT NULL DEFAULT 0,
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.commande_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commande_id UUID NOT NULL REFERENCES public.commandes(id) ON DELETE CASCADE,
  produit_id UUID REFERENCES public.produits(id) ON DELETE SET NULL,
  nom_produit TEXT NOT NULL,
  prix_unitaire INTEGER NOT NULL DEFAULT 0,
  quantite INTEGER NOT NULL DEFAULT 1 CHECK (quantite > 0),
  couleur TEXT NOT NULL DEFAULT '',
  pointure TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS public.demandes_personnalisation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entreprise TEXT NOT NULL,
  telephone TEXT NOT NULL,
  details TEXT NOT NULL DEFAULT '',
  logo_url TEXT NOT NULL DEFAULT '',
  statut TEXT NOT NULL DEFAULT 'nouvelle' CHECK (statut IN ('nouvelle', 'en_cours', 'terminee', 'annulee')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_produits_categorie ON public.produits(categorie);
CREATE INDEX IF NOT EXISTS idx_produits_date_ajout ON public.produits(date_ajout DESC);
CREATE INDEX IF NOT EXISTS idx_commandes_statut ON public.commandes(statut);
CREATE INDEX IF NOT EXISTS idx_commandes_created_at ON public.commandes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_commande_items_commande_id ON public.commande_items(commande_id);
CREATE INDEX IF NOT EXISTS idx_contacts_lu ON public.contacts(lu);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON public.contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_demandes_statut ON public.demandes_personnalisation(statut);
