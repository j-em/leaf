import { Newtype, iso } from "newtype-ts";

interface Kb extends Newtype<{ readonly Kb: unique symbol }, number> {}
const Kb = iso<Kb>();

export { Kb };
