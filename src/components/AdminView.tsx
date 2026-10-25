import React, { useEffect, useState } from 'react'
import { ModalPlanos } from './ModalPlanos'
import { supabase } from '../lib/supabase'

export function Header() {
	const [isModalOpen, setIsModalOpen] = useState(false)

	return (
		<>
			<header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#0d3b22', color: '#fff' }}>
				<h2>JURIS QUANT</h2>
				<button
					onClick={() => setIsModalOpen(true)}
					style={{ background: '#d4af37', border: 'none', padding: '0.4rem 1rem', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', color: '#000' }}
				>
					PREMIUM
				</button>
			</header>
			<ModalPlanos isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
		</>
	)
}

interface UserProfile {
	id: string
	email: string
	role: 'free' | 'premium' | 'admin'
	created_at: string
}

interface AdminViewProps {
	onBack: () => void
}

export const AdminView: React.FC<AdminViewProps> = ({ onBack }) => {
	const [profiles, setProfiles] = useState<UserProfile[]>([])
	const [loading, setLoading] = useState(true)
	const [mensagem, setMensagem] = useState<string | null>(null)

	useEffect(() => {
		const fetchProfiles = async () => {
			setLoading(true)
			const { data, error } = await supabase
				.from('profiles')
				.select('*')
				.order('created_at', { ascending: false })

			if (error) {
				console.error('Erro ao buscar perfis:', error.message)
				setMensagem(`Erro ao buscar perfis: ${error.message}`)
			} else {
				setProfiles((data ?? []) as UserProfile[])
			}
			setLoading(false)
		}

		void fetchProfiles()
	}, [])

	const handleRoleChange = async (userId: string, newRole: UserProfile['role']) => {
		const { error } = await supabase
			.from('profiles')
			.update({ role: newRole })
			.eq('id', userId)

		if (error) {
			setMensagem(`Erro ao atualizar: ${error.message}`)
		} else {
			setMensagem('Plano atualizado com sucesso!')
			setProfiles(current => current.map(profile =>
				profile.id === userId ? { ...profile, role: newRole } : profile
			))
		}
		window.setTimeout(() => setMensagem(null), 3000)
	}

	return (
		<div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-100 mt-6">
			<div className="flex justify-between items-center mb-6">
				<div>
					<h1 className="text-2xl font-bold text-gray-800">Painel de Administração</h1>
					<p className="text-sm text-gray-500">Gerencie o plano de acesso dos alunos cadastrados</p>
				</div>
				<button onClick={onBack} className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm font-medium transition">
					← Voltar para a Tela Principal
				</button>
			</div>

			{mensagem && <div role="status" className="mb-4 p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-sm">{mensagem}</div>}

			{loading ? (
				<div className="text-center py-10 text-gray-500">Carregando usuários...</div>
			) : (
				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-600 uppercase">
								<th className="py-3 px-4">Email</th>
								<th className="py-3 px-4">Data de Cadastro</th>
								<th className="py-3 px-4">Status / Plano</th>
								<th className="py-3 px-4 text-center">Ações</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 text-sm">
							{profiles.map(user => (
								<tr key={user.id} className="hover:bg-gray-50 transition">
									<td className="py-3 px-4 font-medium text-gray-800">{user.email}</td>
									<td className="py-3 px-4 text-gray-500">{new Date(user.created_at).toLocaleDateString('pt-BR')}</td>
									<td className="py-3 px-4">
										<span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : user.role === 'premium' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
											{user.role.toUpperCase()}
										</span>
									</td>
									<td className="py-3 px-4 text-center">
										<div className="flex justify-center gap-2">
											{user.role !== 'premium' && <button onClick={() => void handleRoleChange(user.id, 'premium')} className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold transition">Ativar Premium</button>}
											{user.role !== 'free' && <button onClick={() => void handleRoleChange(user.id, 'free')} className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-xs font-semibold transition">Mudar p/ Grátis</button>}
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	)
}
