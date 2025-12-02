import type { Metadata } from "next";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Curiosidades | Guilherme Portella",
  description: "Filmes, séries e músicas que gosto , sessão não-técnica do site.",
};

export default function CuriosidadesPage() {
  return (
    <main className="mx-auto max-w-4xl p-6 space-y-10">
      <header className="space-y-2 border-b border-neutral-800 pb-4">
        <h1 className="text-4xl font-bold">Curiosidades</h1>
        <p className="text-neutral-700 text-lg">
          Fora da arquitetura: o que eu assisto e escuto.
        </p>
      </header>

      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Entretenimento & Interesses</h2>
          <p className="text-neutral-900">
            Quando não estou estudando ou trabalhando, provavelmente estou fazendo alguma coisa dessa lista:
          </p>
        </div>

        {/* Filmes */}
        <div className="space-y-3 pl-2 border-l-2 border-blue-500">
          <h3 className="text-lg font-semibold text-blue-600 flex items-center gap-2">
            🎬 Filmes
          </h3>
          <ul className="list-disc list-inside text-neutral-900 space-y-1 ml-2">
            <li><em>Interstellar</em> (Nolan)</li>
            <li><em>Inception</em> (Nolan)</li>
            <li><em>The Dark Knight</em></li>
            <li><em>Pulp Fiction</em></li>
          </ul>
        </div>

        {/* Séries */}
        <div className="space-y-3 pl-2 border-l-2 border-purple-500">
          <h3 className="text-lg font-semibold text-purple-600 flex items-center gap-2">
            📺 Séries
          </h3>
          <ul className="list-disc list-inside text-neutral-900 space-y-1 ml-2">
            <li><em>Mr. Robot</em></li>
            <li><em>Rick and Morty</em></li>
            <li><em>Yellowstone</em></li>
            <li><em>The Big Bang Theory</em></li>
            <li><em>Breaking Bad</em></li>
          </ul>
        </div>

        {/* Jogos */}
        <div className="space-y-3 pl-2 border-l-2 border-green-500">
          <h3 className="text-lg font-semibold text-green-600 flex items-center gap-2">
            🎮 Jogos
          </h3>
          <ul className="list-disc list-inside text-neutral-900 space-y-1 ml-2">
            <li><em>The Witcher 3</em></li>
            <li><em>Cyberpunk 2077</em></li>
            <li><em>Dark Souls</em></li>
            <li><em>Red Dead Redemption 2</em></li>
          </ul>
        </div>

        {/* Livros */}
        <div className="space-y-3 pl-2 border-l-2 border-amber-500">
          <h3 className="text-lg font-semibold text-amber-600 flex items-center gap-2">
            📚 Livros
          </h3>
          <ul className="list-disc list-inside text-neutral-900 space-y-1 ml-2">
            <li><em>O Homem que Calculava</em> (Malba Tahan)</li>
            <li><em>Sapiens</em> (Yuval Harari)</li>
            <li><em>O Código Da Vinci</em> (Dan Brown)</li>
            <li><em>1984</em> (George Orwell)</li>
          </ul>
        </div>

        {/* Tecnologia */}
        <div className="space-y-3 pl-2 border-l-2 border-cyan-500">
          <h3 className="text-lg font-semibold text-cyan-600 flex items-center gap-2">
            ⌨️ Tecnologia
          </h3>
          <ul className="list-disc list-inside text-neutral-900 space-y-1 ml-2">
            <li>YouTube: Canais de programação e desenvolvimento</li>
            <li>Podcasts tech e arquitetura de software</li>
            <li>Documentação e artigos técnicos</li>
            <li>Comunidades online de desenvolvimento</li>
          </ul>
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-3 pl-2 border-l-2 border-red-500">
          <h3 className="text-lg font-semibold text-red-600 flex items-center gap-2">
            🎵 Músicas
          </h3>
          <p className="text-neutral-700 text-sm">Minha trilha sonora pessoal</p>
        </div>

        <div className="rounded-xl overflow-hidden">
          <iframe
            title="Playlist do Spotify — Guilherme Portella"
            data-testid="embed-iframe"
            style={{ borderRadius: 12 }}
            src="https://open.spotify.com/embed/playlist/3LuwLZF9DuqtT5n92wCmcU?utm_source=generator&theme=0"
            width="100%"
            height="480"
            frameBorder={0}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>

        <p className="text-sm text-neutral-600">
          Caso o player não carregue, você pode{" "}
          <a
            href="https://open.spotify.com/playlist/3LuwLZF9DuqtT5n92wCmcU"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-600 underline underline-offset-2 hover:text-red-700"
          >
            abrir a playlist diretamente no Spotify →
          </a>
        </p>
      </section>

      <Footer />
    </main>
  );
}