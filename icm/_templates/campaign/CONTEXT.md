# Campaign Template

Copy this folder to `icm/campaigns/<campaign-slug>/`. Start at `01_intake`. Each stage reads only its contract plus named inputs. The exact public artifact must stop at `05_review` until a human approval receipt exists.

Status is the deepest stage whose required `output/` artifact exists and validates. Never infer success from chat memory.
