from llama_index import StorageContext, load_index_from_storage

# load knowledge base from disk. you may want to move this outside of the answer question function to increase performance
index = load_index_from_storage(
  StorageContext.from_defaults(persist_dir="storage"))

# make the knowledge base into a query engine—an object that queries can be run on
query_engine = index.as_query_engine()


def answer_question(query):
  # run a query on the query engine. this will:
  # find text chunks that are similar to the query we gave it
  # give the query + the text chunks to GPT-3, and then return the answer
  response = query_engine.query(query)

  return response


def answer_questions():
  while True:
    query = input("Ask a question: ")
    if query == "quit":
      break
    response = answer_question(query)
    print(response)
