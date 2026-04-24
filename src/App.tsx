import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Home     from "./pages/Home";
import Services from "./pages/Services";
import Pricing  from "./pages/Pricing";
import OurData  from "./pages/OurData";
import About    from "./pages/About";
import FAQ      from "./pages/FAQ";
import Estimate  from "./pages/Estimate";
import NotFound  from "./pages/NotFound";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      <Route path="/"        element={<Home />} />
      <Route path="/services" element={<Services />} />
      <Route path="/pricing"  element={<Pricing />} />
      <Route path="/data"     element={<OurData />} />
      <Route path="/about"    element={<About />} />
      <Route path="/faq"      element={<FAQ />} />
      <Route path="/estimate" element={<Estimate />} />
      <Route path="*"         element={<NotFound />} />
    </Routes>
    </>
  );
}
