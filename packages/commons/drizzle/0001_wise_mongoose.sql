
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_name = 'subject_data_responses' AND table_schema = 'att'
  ) AND NOT EXISTS (
    SELECT FROM information_schema.table_constraints
    WHERE constraint_name = 'unique_sdr_list_req_subject' AND table_schema = 'att'
  ) THEN
    ALTER TABLE "att"."subject_data_responses" ADD CONSTRAINT "unique_sdr_list_req_subject" UNIQUE("list_request_id","subject_id");
  END IF;
END $$;
