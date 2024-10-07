import { MagnifyingGlass } from "phosphor-react";
import { SearchFormContainer } from "./styles";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionsContext } from "../../../../context/TransactionsContext";
import { useContextSelector } from "use-context-selector";

/**
NOTE: fluxo de rendereização do React
1 - O React recria o HTML da interface daquele componente
2 - Compara a versão do html recriada com a versão anterior
3 - Se mudou alguma ele reescreve o HTML na tela
*/

/**
 * NOTE: Sobre o Memo:
 * Mudou algo nos hooks ou nas props(deep comparison)?
 * Compara com a versão anterior dos hooks ou props
 * Se mudou algo, ele vai permitir a nova rendedização
 *
 * Usamos o Memo quando um componente tem um html pesado
 * Para componentes simples não é necessário usar o memo.
 */

const searchFormSchema = z.object({
  query: z.string(),
});

type SearchFormInputs = z.infer<typeof searchFormSchema>;

export function SearchForm() {
  const fetchTransactions = useContextSelector(
    TransactionsContext,
    (context) => {
      return context.fetchTransactions;
    }
  );
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SearchFormInputs>({
    resolver: zodResolver(searchFormSchema),
  });

  async function handleSearchTransaction(data: SearchFormInputs) {
    await fetchTransactions(data.query);
  }
  return (
    <SearchFormContainer onSubmit={handleSubmit(handleSearchTransaction)}>
      <input
        type="text"
        placeholder="Busque por transações"
        {...register("query")}
      />
      <button type="submit" disabled={isSubmitting}>
        <MagnifyingGlass />
        Buscar
      </button>
    </SearchFormContainer>
  );
}
