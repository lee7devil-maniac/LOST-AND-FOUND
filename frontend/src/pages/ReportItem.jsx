import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Plus, ChevronLeft, Image as ImageIcon, MapPin, Tag, Info } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const ReportItem = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Electronics',
        location: '',
        type: 'lost'
    });
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const newImages = [...images, ...files].slice(0, 5);
            setImages(newImages);
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setPreviews([...previews, ...newPreviews].slice(0, 5));
        }
    };

    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        const newPreviews = previews.filter((_, i) => i !== index);
        setImages(newImages);
        setPreviews(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        try {
            let imageUrl = '';
            let imagesArray = [];
            if (images.length > 0) {
                const imgData = new FormData();
                images.forEach(img => imgData.append('images', img));
                const uploadRes = await api.post('/upload/multiple', imgData);
                imagesArray = uploadRes.data.data;
                imageUrl = imagesArray[0]; // For backward compatibility
            }

            await api.post('/items', { ...formData, imageUrl, images: imagesArray });
            toast.success('Item reported successfully');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to report item');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <header className="flex items-center justify-between">
                <div>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1 text-sm font-bold text-gray-400 hover:text-mcc-maroon transition-colors mb-2 uppercase tracking-widest"
                    >
                        <ChevronLeft size={16} /> Back to Hub
                    </button>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                        Post a <span className="text-mcc-maroon">Report</span>
                    </h1>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-soft space-y-8">
                        {/* Type Toggle */}
                        <div className="flex p-1 bg-gray-50 rounded-2xl">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'lost' })}
                                className={`flex-1 py-3 rounded-xl font-bold transition-all ${formData.type === 'lost' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-400'}`}
                            >
                                Lost Item
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'found' })}
                                className={`flex-1 py-3 rounded-xl font-bold transition-all ${formData.type === 'found' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-400'}`}
                            >
                                Found Item
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="relative">
                                <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                                    <Tag size={14} /> Item Name
                                </label>
                                <input
                                    name="title"
                                    type="text"
                                    required
                                    placeholder="e.g., MacBook Pro 14 with stickers"
                                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-gray-900 focus:ring-2 focus:ring-mcc-maroon/20 transition-all font-medium"
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="relative">
                                    <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                                        <Info size={14} /> Category
                                    </label>
                                    <select
                                        name="category"
                                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-gray-900 focus:ring-2 focus:ring-mcc-maroon/20 appearance-none cursor-pointer"
                                        value={formData.category}
                                        onChange={handleChange}
                                    >
                                        <option value="Electronics">Electronics</option>
                                        <option value="Books">Books</option>
                                        <option value="Clothing">Clothing</option>
                                        <option value="Keys">Keys</option>
                                        <option value="ID Cards">ID Cards</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="relative">
                                    <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                                        <MapPin size={14} /> Last seen Location
                                    </label>
                                    <input
                                        name="location"
                                        type="text"
                                        required
                                        placeholder="e.g., Pavilion, Library"
                                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-gray-900 focus:ring-2 focus:ring-mcc-maroon/20 transition-all font-medium"
                                        value={formData.location}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                                    Detailed Description
                                </label>
                                <textarea
                                    name="description"
                                    rows="5"
                                    required
                                    placeholder="Provide any unique identifying marks, brand names, or specific details..."
                                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-gray-900 focus:ring-2 focus:ring-mcc-maroon/20 transition-all font-medium resize-none"
                                    value={formData.description}
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Image Upload Box */}
                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-soft">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-1">Media Assets</label>
                        <div className="grid grid-cols-2 gap-4">
                            {previews.map((prev, index) => (
                                <div key={index} className="relative group overflow-hidden bg-gray-50 border-2 border-gray-100 rounded-2xl aspect-square">
                                    <img src={prev} alt={`Preview ${index}`} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                            {previews.length < 5 && (
                                <div className="relative group overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl aspect-square flex flex-col items-center justify-center cursor-pointer transition-all hover:border-mcc-maroon/50">
                                    <div className="flex flex-col items-center text-center p-4">
                                        <div className="w-10 h-10 bg-white text-mcc-maroon rounded-xl flex items-center justify-center shadow-soft mb-2 group-hover:scale-110 transition-transform">
                                            <Plus size={24} />
                                        </div>
                                        <p className="text-[10px] font-bold text-gray-900">Add Image</p>
                                    </div>
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        multiple
                                    />
                                </div>
                            )}
                        </div>
                        {previews.length === 0 && (
                            <p className="text-[10px] text-gray-400 mt-4 text-center italic">Up to 5 images supported</p>
                        )}
                    </div>

                    {/* Submit Actions */}
                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-soft">
                        <div className="space-y-4">
                            <button
                                type="submit"
                                disabled={uploading}
                                className="w-full bg-mcc-maroon text-white font-black py-4 rounded-2xl shadow-lg shadow-mcc-maroon/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {uploading ? 'Processing...' : <><Plus size={20} /> Publish Report</>}
                            </button>
                            <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest leading-relaxed">
                                Your report will be visible to all verified students immediately.
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ReportItem;
