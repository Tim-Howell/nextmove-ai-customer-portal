-- Migration: Add `preferences jsonb` to profiles for per-user UI preferences.
--
-- Used initially by the Quick Time Entry flow to remember the last customer
-- and contract a user logged time against. Future preferences (default
-- dashboard period, etc.) can extend the same column without schema churn.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS preferences jsonb NOT NULL DEFAULT '{}'::jsonb;
