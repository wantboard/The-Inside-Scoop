from llama_index import StorageContext, load_index_from_storage, GPTKeywordTableIndex, SimpleDirectoryReader, LLMPredictor, ServiceContext
from llama_index.query_engine import RetrieverQueryEngine
from llama_index.indices.postprocessor import SimilarityPostprocessor
from llama_index import ResponseSynthesizer
from llama_index.retrievers import VectorIndexRetriever

def answer_question(query, restaurant, service_context):
  
  index = load_index_from_storage(
    StorageContext.from_defaults(persist_dir=f"storage/{restaurant}.txt"), service_context=service_context)

  # configure retriever
  retriever = VectorIndexRetriever(
      index=index, 
      similarity_top_k=3,
      streaming=True,
  )

  # configure response synthesizer
  response_synthesizer = ResponseSynthesizer.from_args(
      node_postprocessors=[
          SimilarityPostprocessor(similarity_cutoff=0.7)
      ]
  )

  # assemble query engine
  query_engine = RetrieverQueryEngine(
      retriever=retriever,
      response_synthesizer=response_synthesizer,
  )

  response = query_engine.query(query)

  return response


def answer_questions():
  while True:
    restaurant = input("Select a restaurant: ")
    query = input("Ask a question: ")
    if query == "quit":
      break
    response = answer_question(query, restaurant)
    print(response)
