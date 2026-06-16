import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

import Home from '../pages/Home';
import PSGTV from '../pages/PSGTV';
import VideoDetail from '../pages/VideoDetail';
import Gallery from '../pages/Gallery';
import Stadium from '../pages/Stadium';
import Campus from '../pages/Campus';
import Sponsors from '../pages/Sponsors';
import Club from '../pages/Club';
import Team from '../pages/Team';
import PlayerDetail from '../pages/PlayerDetail';
import StaffPage from '../pages/StaffPage';
import News from '../pages/News';
import NewsDetail from '../pages/NewsDetail';
import Matches from '../pages/Matches';
import MatchDetail from '../pages/MatchDetail';
import Standings from '../pages/Standings';
import Shop from '../pages/Shop';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import OrderConfirmation from '../pages/OrderConfirmation';
import Ticketing from '../pages/Ticketing';
import TicketPurchase from '../pages/TicketPurchase';
import TicketConfirmation from '../pages/TicketConfirmation';
import StadiumTour from '../pages/StadiumTour';
import TourBooking from '../pages/TourBooking';
import TourBookingConfirmation from '../pages/TourBookingConfirmation';
import MyTourBookings from '../pages/member/MyTourBookings';
import EditProfile from '../pages/member/EditProfile';
import Contact from '../pages/Contact';
import Press from '../pages/Press';

import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Confirmation from '../pages/auth/Confirmation';

import MemberDashboard from '../pages/member/Dashboard';
import MyTickets from '../pages/member/MyTickets';
import MyOrders from '../pages/member/MyOrders';

import AdminDashboard from '../pages/admin/AdminDashboard';
import ManagePlayers from '../pages/admin/ManagePlayers';
import ManageMatches from '../pages/admin/ManageMatches';
import ManageArticles from '../pages/admin/ManageArticles';
import ManageUsers from '../pages/admin/ManageUsers';
import ManageProducts from '../pages/admin/ManageProducts';
import ManageTours from '../pages/admin/ManageTours';

function RequireAuth({ children }: { children: React.ReactElement }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? children : <Navigate to="/connexion" replace />;
}

function RequireAdmin({ children }: { children: React.ReactElement }) {
  const { isAdmin, loading } = useAuth();
  if (loading) return null;
  return isAdmin ? children : <Navigate to="/" replace />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1">
          <Routes>
            {/* Pages publiques */}
            <Route path="/" element={<Home />} />
            <Route path="/psg-tv" element={<PSGTV />} />
            <Route path="/psg-tv/:id" element={<VideoDetail />} />
            <Route path="/galerie" element={<Gallery />} />
            <Route path="/stade" element={<Stadium />} />
            <Route path="/campus" element={<Campus />} />
            <Route path="/sponsors" element={<Sponsors />} />
            <Route path="/club" element={<Club />} />
            <Route path="/equipe" element={<Team />} />
            <Route path="/equipe/:id" element={<PlayerDetail />} />
            <Route path="/staff" element={<StaffPage />} />
            <Route path="/actualites" element={<News />} />
            <Route path="/actualites/:slug" element={<NewsDetail />} />
            <Route path="/matchs" element={<Matches />} />
            <Route path="/matchs/:id" element={<MatchDetail />} />
            <Route path="/classement" element={<Standings />} />
            <Route path="/boutique" element={<Shop />} />
            <Route path="/boutique/:id" element={<ProductDetail />} />
            <Route path="/panier" element={<Cart />} />
            <Route path="/commande" element={<RequireAuth><Checkout /></RequireAuth>} />
            <Route path="/commande-confirmee" element={<RequireAuth><OrderConfirmation /></RequireAuth>} />
            <Route path="/billets" element={<Navigate to="/billetterie" replace />} />
            <Route path="/billetterie" element={<Ticketing />} />
            {/* /billetterie/confirmation doit être AVANT /:matchId pour éviter le conflit de route */}
            <Route path="/billetterie/confirmation" element={<RequireAuth><TicketConfirmation /></RequireAuth>} />
            <Route path="/billetterie/:matchId" element={<RequireAuth><TicketPurchase /></RequireAuth>} />
            <Route path="/tour" element={<StadiumTour />} />
            {/* /tour/confirmation doit être AVANT /:tourId/reserver pour éviter le conflit de route */}
            <Route path="/tour/confirmation" element={<RequireAuth><TourBookingConfirmation /></RequireAuth>} />
            <Route path="/tour/:tourId/reserver" element={<RequireAuth><TourBooking /></RequireAuth>} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/presse" element={<Press />} />

            {/* Auth */}
            <Route path="/connexion" element={<Login />} />
            <Route path="/inscription" element={<Register />} />
            <Route path="/confirmation" element={<Confirmation />} />

            {/* Espace membre */}
            <Route path="/mon-espace" element={<RequireAuth><MemberDashboard /></RequireAuth>} />
            <Route path="/mon-espace/billets" element={<RequireAuth><MyTickets /></RequireAuth>} />
            <Route path="/mon-espace/commandes" element={<RequireAuth><MyOrders /></RequireAuth>} />
            <Route path="/mon-espace/excursions" element={<RequireAuth><MyTourBookings /></RequireAuth>} />
            <Route path="/mon-espace/profil" element={<RequireAuth><EditProfile /></RequireAuth>} />

            {/* Admin */}
            <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
            <Route path="/admin/joueurs" element={<RequireAdmin><ManagePlayers /></RequireAdmin>} />
            <Route path="/admin/matchs" element={<RequireAdmin><ManageMatches /></RequireAdmin>} />
            <Route path="/admin/articles" element={<RequireAdmin><ManageArticles /></RequireAdmin>} />
            <Route path="/admin/utilisateurs" element={<RequireAdmin><ManageUsers /></RequireAdmin>} />
            <Route path="/admin/produits" element={<RequireAdmin><ManageProducts /></RequireAdmin>} />
            <Route path="/admin/visites" element={<RequireAdmin><ManageTours /></RequireAdmin>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
