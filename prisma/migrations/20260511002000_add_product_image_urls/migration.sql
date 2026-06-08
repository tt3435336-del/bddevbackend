ALTER TABLE public.produits
ADD COLUMN IF NOT EXISTS image_urls TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

UPDATE public.produits
SET image_urls = ARRAY[image_url]
WHERE image_url <> ''
  AND cardinality(image_urls) = 0;
