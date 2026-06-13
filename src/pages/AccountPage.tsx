import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User, Package, ShieldCheck, Headset, LogOut,
    Mail, Phone, MapPin, Loader2, X, Edit3, Eye, ShoppingBag
} from 'lucide-react';
import { UserService } from '../services/userService';
import { OrderService } from '../services/OrderService';
import { Button } from '../components/ui/Button';

export const AccountPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [userData, setUserData] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [ordersLoading, setOrdersLoading] = useState(false);
    
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedItemDetail, setSelectedItemDetail] = useState<any>(null);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', phoneNumber: '',
        landmark: '', area: '', city: '', state: '', pincode: ''
    });

    // 1. Fetch User Profile
    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await UserService.getUser();
            if (response.success) {
                setUserData(response.data);
                setFormData({
                    firstName: response.data.firstName || '',
                    lastName: response.data.lastName || '',
                    phoneNumber: response.data.phoneNumber || '',
                    landmark: response.data.address?.landmark || '',
                    area: response.data.address?.area || '',
                    city: response.data.address?.city || '',
                    state: response.data.address?.state || '',
                    pincode: response.data.address?.pincode || ''
                });
            }
        } catch (error) { console.error(error); } finally { setLoading(false); }
    };

    // 2. Fetch Orders
    const fetchOrders = async () => {
        try {
            setOrdersLoading(true);
            const response = await OrderService.getUserOrders();
            if (response.success) setOrders(response.data);
        } catch (error) { console.error(error); } finally { setOrdersLoading(false); }
    };

    useEffect(() => { fetchProfile(); }, []);
    useEffect(() => { if (activeTab === 'orders') fetchOrders(); }, [activeTab]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            const payload = {
                firstName: formData.firstName, lastName: formData.lastName,
                phoneNumber: formData.phoneNumber,
                address: {
                    landmark: formData.landmark, area: formData.area,
                    city: formData.city, state: formData.state, pincode: formData.pincode
                }
            };
            await UserService.UpdateProfile(payload);
            await fetchProfile();
            setIsEditModalOpen(false);
        } catch (error) { alert("Update failed"); } finally { setIsUpdating(false); }
    };

    // Helper: Component for Order Tracking
    const OrderStatusStepper = ({ currentStatus }: { currentStatus: string }) => {
        const statuses = ["Confirmed", "Placed", "Packaging", "Out of Delivery", "Delivered"];
        const currentIndex = statuses.indexOf(currentStatus);
        return (
            <div className="w-full py-8">
                <div className="flex items-center justify-between relative">
                    <div className="absolute top-2 left-0 w-full h-0.5 bg-gray-100 z-0" />
                    <div className="absolute top-2 left-0 h-0.5 bg-blue-600 transition-all duration-500 z-0" style={{ width: `${(currentIndex / (statuses.length - 1)) * 100}%` }} />
                    {statuses.map((s, i) => (
                        <div key={s} className="relative z-10 flex flex-col items-center">
                            <div className={`w-4 h-4 rounded-full border-2 ${i <= currentIndex ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`} />
                            <p className={`text-[9px] mt-2 font-bold uppercase tracking-tighter ${i <= currentIndex ? 'text-blue-600' : 'text-gray-400'}`}>{s}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
                
                {/* --- Sidebar --- */}
                <aside className="w-full md:w-1/4">
                    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6 border border-gray-100">
                        <div className="text-center md:text-left">
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto md:mx-0 mb-4 text-2xl font-bold text-blue-600 uppercase">
                                {userData?.firstName?.[0]}{userData?.lastName?.[0]}
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">{userData?.firstName} {userData?.lastName}</h2>
                            <p className="text-xs text-gray-400">Personal Account</p>
                        </div>
                        <nav className="space-y-1">
                            {[
                                { id: 'profile', label: 'User Information', icon: User },
                                { id: 'orders', label: 'My Orders', icon: Package },
                                { id: 'terms', label: 'Terms & Conditions', icon: ShieldCheck },
                                { id: 'support', label: 'Customer Care', icon: Headset },
                            ].map((item) => (
                                <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === item.id ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'text-gray-500 hover:bg-gray-50'}`}>
                                    <item.icon size={18} /> {item.label}
                                </button>
                            ))}
                            <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl mt-4 border-t pt-4">
                                <LogOut size={18} /> Logout
                            </button>
                        </nav>
                    </div>
                </aside>

                {/* --- Main Content --- */}
                <main className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                    
                    {activeTab === 'profile' && (
                        <div className="animate-in fade-in duration-500">
                            <div className="flex justify-between items-center mb-8 pb-4 border-b">
                                <h3 className="text-2xl font-bold">Profile Details</h3>
                                <button onClick={() => setIsEditModalOpen(true)} className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100"><Edit3 size={14} /> EDIT</button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <DetailItem icon={Mail} label="Email Address" value={userData?.email} />
                                <DetailItem icon={Phone} label="Contact" value={userData?.phoneNumber || 'N/A'} />
                                <div className="sm:col-span-2">
                                    <DetailItem icon={MapPin} label="Delivery Address" value={userData?.address ? `${userData.address.area}, ${userData.address.landmark}, ${userData.address.city}, ${userData.address.state} - ${userData.address.pincode}` : 'No address saved.'} />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div className="animate-in fade-in duration-500">
                            <h3 className="text-2xl font-bold mb-6">Purchase History</h3>
                            {ordersLoading ? (
                                <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={32} /></div>
                            ) : orders.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b text-gray-400 text-[10px] uppercase tracking-widest font-black">
                                                <th className="pb-4">Vendor Order ID</th>
                                                <th className="pb-4">Product</th>
                                                <th className="pb-4">Status</th>
                                                <th className="pb-4">Price</th>
                                                <th className="pb-4 text-right">Details</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {orders.map((parentOrder) => 
                                                parentOrder.items.map((item: any, idx: number) => (
                                                    <tr key={`${parentOrder._id}-${idx}`} className="group hover:bg-gray-50/50 transition-colors">
                                                        <td className="py-5 font-bold text-gray-700 text-xs uppercase">{item.OrderId || "Pending"}</td>
                                                        <td className="py-5">
                                                            <p className="text-sm font-bold text-gray-800 line-clamp-1">{item.productName}</p>
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase">{item.vendorDetails?.vendorName}</p>
                                                        </td>
                                                        <td className="py-5">
                                                            <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[9px] font-black rounded uppercase border border-blue-100">
                                                                {parentOrder.orderStatus?.current || 'Confirmed'}
                                                            </span>
                                                        </td>
                                                        <td className="py-5 font-bold text-gray-900 text-sm">₹{item.price}</td>
                                                        <td className="py-5 text-right">
                                                            <button 
                                                                onClick={() => { setSelectedItemDetail({ ...item, parent: parentOrder }); setIsOrderModalOpen(true); }}
                                                                className="p-2 bg-gray-50 group-hover:bg-blue-600 group-hover:text-white text-gray-400 rounded-lg transition-all"
                                                            >
                                                                <Eye size={18} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                    <ShoppingBag size={48} className="mx-auto text-gray-200 mb-4" />
                                    <p className="text-gray-400 font-bold uppercase text-sm tracking-widest">No Purchases found</p>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>

            {/* --- EDIT MODAL --- */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-3xl w-full max-w-2xl my-auto shadow-2xl relative">
                        <div className="flex items-center justify-between px-8 py-5 border-b sticky top-0 bg-white rounded-t-3xl z-10">
                            <h3 className="text-xl font-bold">Update Profile</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20}/></button>
                        </div>
                        <form onSubmit={handleUpdate} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-5">
                            <InputGroup label="First Name" value={formData.firstName} onChange={(v) => setFormData({...formData, firstName: v})} />
                            <InputGroup label="Last Name" value={formData.lastName} onChange={(v) => setFormData({...formData, lastName: v})} />
                            <InputGroup label="Phone" type="number" value={formData.phoneNumber} onChange={(v) => setFormData({...formData, phoneNumber: v})} />
                            <InputGroup label="Landmark" value={formData.landmark} onChange={(v) => setFormData({...formData, landmark: v})} />
                            <InputGroup label="Area" value={formData.area} onChange={(v) => setFormData({...formData, area: v})} />
                            <InputGroup label="City" value={formData.city} onChange={(v) => setFormData({...formData, city: v})} />
                            <InputGroup label="State" value={formData.state} onChange={(v) => setFormData({...formData, state: v})} />
                            <InputGroup label="Pincode" type="number" value={formData.pincode} onChange={(v) => setFormData({...formData, pincode: v})} />
                            <div className="md:col-span-2 pt-4">
                                <Button type="submit" className="w-full h-12 text-sm font-bold uppercase tracking-widest" disabled={isUpdating}>
                                    {isUpdating ? <><Loader2 className="animate-spin mr-2" size={16}/> Saving...</> : 'Save Profile'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- ORDER ITEM DETAILS MODAL --- */}
            {isOrderModalOpen && selectedItemDetail && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-3xl w-full max-w-3xl my-auto shadow-2xl relative">
                        <div className="flex items-center justify-between px-8 py-5 border-b sticky top-0 bg-white rounded-t-3xl z-10">
                            <div>
                                <h3 className="text-xl font-bold uppercase">Item Details</h3>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Tracking ID: {selectedItemDetail.parent.trackingId || "N/A"}</p>
                            </div>
                            <button onClick={() => setIsOrderModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20}/></button>
                        </div>
                        
                        <div className="p-8 space-y-8">
                            <OrderStatusStepper currentStatus={selectedItemDetail.parent.orderStatus?.current || "Confirmed"} />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Product Manifest</h4>
                                        <div className="p-4 bg-gray-50 rounded-2xl border">
                                            <p className="font-bold text-gray-800">{selectedItemDetail.productName}</p>
                                            <div className="mt-2 text-[10px] font-bold text-gray-500 uppercase flex gap-4">
                                                <span>Qty: {selectedItemDetail.quantity}</span>
                                                <span>Size: {selectedItemDetail.size}</span>
                                                <span>Color: {selectedItemDetail.colorName}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Vendor Logic</h4>
                                        <div className="p-4 border rounded-2xl flex justify-between items-center">
                                            <div>
                                                <p className="text-sm font-bold text-gray-800">{selectedItemDetail.vendorDetails?.vendorName}</p>
                                                <p className="text-[9px] text-gray-400 font-bold uppercase">GST: {selectedItemDetail.vendorDetails?.gstNumber}</p>
                                            </div>
                                            <p className="text-xs font-bold text-gray-400">{selectedItemDetail.OrderId}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="p-5 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-4">Payment Summary</h4>
                                        <div className="space-y-2 text-xs font-bold">
                                            <div className="flex justify-between"><span>Subtotal (Net)</span><span>₹{selectedItemDetail.price}</span></div>
                                            <div className="flex justify-between text-green-300"><span>Coupon Applied</span><span>- ₹{selectedItemDetail.Coupon?.[0]?.discountAmount || 0}</span></div>
                                            <div className="flex justify-between"><span>Tax (GST)</span><span>₹{selectedItemDetail.taxAmount}</span></div>
                                            <div className="flex justify-between border-t border-blue-500 pt-2 text-lg"><span>Total</span><span>₹{selectedItemDetail.totalPrice || selectedItemDetail.price}</span></div>
                                        </div>
                                    </div>

                                    <div className="p-5 border rounded-2xl">
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Shipping Log</h4>
                                        <p className="text-xs text-gray-600 leading-relaxed">
                                            {selectedItemDetail.parent.address.area}, {selectedItemDetail.parent.address.landmark},<br />
                                            {selectedItemDetail.parent.address.city}, {selectedItemDetail.parent.address.state} - {selectedItemDetail.parent.address.pincode}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Original Clean Sub-components
const DetailItem = ({ icon: Icon, label, value }: any) => (
    <div className="flex items-start gap-4 p-4 border border-gray-100 rounded-2xl bg-gray-50/30">
        <div className="p-3 bg-white rounded-xl shadow-sm text-blue-600 border border-gray-100"><Icon size={20} /></div>
        <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
            <p className="text-gray-800 font-bold text-sm leading-tight">{value}</p>
        </div>
    </div>
);

const InputGroup = ({
    label,
    value,
    type = "text", // Default to text
    onChange
}: {
    label: string;
    value: string;
    type?: "text" | "number";
    onChange: (v: string) => void
}) => (
    <div className="space-y-1">
        <label className="text-xs font-bold text-gray-500 uppercase">{label}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onWheel={(e) => type === "number" && (e.target as HTMLElement).blur()} // Prevent accidental scroll change
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
    </div>
);