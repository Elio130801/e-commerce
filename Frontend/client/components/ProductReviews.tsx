"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2"; // 👇 Importamos SweetAlert2
import StarRating from "./ui/StarRating";

interface Review {
    id: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
}

interface ProductReviewsProps {
    productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [userName, setUserName] = useState("");
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchReviews = async () => {
        try {
            const res = await fetch(`http://localhost:4000/reviews/product/${productId}`);
            if (res.ok) {
                const data = await res.json();
                setReviews(data);
            }
        } catch (error) {
            console.error("Error cargando reseñas:", error);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // 👇 Alerta de advertencia si faltan campos
        if (!userName.trim() || !comment.trim()) {
            return Swal.fire({
                title: 'Campos incompletos',
                text: 'Por favor, dinos tu nombre y qué te pareció el producto.',
                icon: 'warning',
                confirmButtonColor: '#000000',
                borderRadius: '15px'
            });
        }
        
        setIsSubmitting(true);
        try {
            const res = await fetch("http://localhost:4000/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, userName, rating, comment }),
            });

            if (res.ok) {
                setUserName("");
                setComment("");
                setRating(5);
                fetchReviews();

                // 👇 Alerta de éxito personalizada
                Swal.fire({
                    title: '¡Gracias, Elio!',
                    text: 'Tu opinión ha sido publicada con éxito.',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 2500,
                    timerProgressBar: true,
                    iconColor: '#D4AF37', // Color dorado para las estrellas/éxito
                    borderRadius: '20px'
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'No pudimos guardar tu reseña. Inténtalo de nuevo.',
                icon: 'error',
                confirmButtonColor: '#000000'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const averageRating = reviews.length 
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) 
        : "0";

    return (
        <div className="mt-16 border-t border-gray-200 pt-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Opiniones de Clientes</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-1 bg-gray-50 p-6 rounded-2xl border border-gray-100 h-fit">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Deja tu reseña</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Calificación</label>
                            <StarRating rating={rating} setRating={setRating} isInteractive={true} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tu Nombre</label>
                            <input 
                                type="text" 
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder="Ej: María Gómez"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Comentario</label>
                            <textarea 
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={4}
                                placeholder="¿Qué te pareció el producto?"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none text-sm resize-none"
                            ></textarea>
                        </div>
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                        >
                            {isSubmitting ? "Enviando..." : "Enviar Opinión"}
                        </button>
                    </form>
                </div>

                <div className="md:col-span-2">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="text-4xl font-bold text-gray-900">{averageRating}</div>
                        <div>
                            <StarRating rating={Math.round(Number(averageRating))} />
                            <p className="text-sm text-gray-500 mt-1">Basado en {reviews.length} reseñas</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {reviews.length === 0 ? (
                            <p className="text-gray-500 italic">Aún no hay opiniones. ¡Sé el primero en dejar una!</p>
                        ) : (
                            reviews.map((review) => (
                                <div key={review.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-bold text-gray-900">{review.userName}</p>
                                            <p className="text-xs text-gray-400">
                                                {new Date(review.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </p>
                                        </div>
                                        <StarRating rating={review.rating} />
                                    </div>
                                    <p className="text-gray-600 text-sm mt-3">{review.comment}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}