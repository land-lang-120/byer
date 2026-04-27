-- ════════════════════════════════════════════════════════════════════
-- Byer — Hotfix : contrainte unique partielle sur kyc_documents
-- À exécuter APRÈS 0010_seed_demo_listings.sql, AVANT le 1er deploy
-- de l'Edge Function kyc-review.
-- ════════════════════════════════════════════════════════════════════
-- Pourquoi ce fix :
--   La mig.0004 a posé `unique (user_id, doc_type, status) deferrable
--   initially deferred`. Cette contrainte interdit d'avoir 2 documents
--   du même statut pour le même user+type — ce qui bloque le scénario
--   réel où un user soumet une 2ème CNI après que la 1ère a été approved
--   (ou rejected) : on ne peut pas avoir 2 'rejected' du même type.
--
--   Le métier veut :
--     - 1 seul 'approved' par (user_id, doc_type)  ← règle business
--     - autant de 'pending'/'rejected' qu'on veut (historique d'audit)
--
--   On remplace donc la contrainte par un INDEX UNIQUE PARTIEL qui ne
--   s'applique qu'aux lignes 'approved'. Le reste de l'historique
--   (pending, rejected) peut s'accumuler sans conflit.
-- ════════════════════════════════════════════════════════════════════

-- 1) Drop l'ancienne contrainte unique (composite incluant status)
alter table public.kyc_documents
  drop constraint if exists kyc_documents_user_id_doc_type_status_key;

-- 2) Index unique partiel : 1 seul approved par (user, type)
create unique index if not exists kyc_unique_approved_per_type
  on public.kyc_documents (user_id, doc_type)
  where status = 'approved';

comment on index public.kyc_unique_approved_per_type is
  'Garantit qu''un user ne peut avoir qu''un seul document KYC approuvé par type (CNI, passeport, etc.). Les soumissions pending/rejected antérieures sont conservées pour audit.';

-- ════════════════════════════════════════════════════════════════════
-- Vérification post-migration (à exécuter manuellement dans SQL Editor) :
--
--   -- Doit retourner uniquement l'index partiel, plus la contrainte composite
--   select indexname, indexdef
--     from pg_indexes
--    where tablename = 'kyc_documents';
--
--   -- Test : insérer 2 pending du même type → OK, 2 rejected du même type → OK
--   --        2 approved du même type → ERREUR 23505
-- ════════════════════════════════════════════════════════════════════
